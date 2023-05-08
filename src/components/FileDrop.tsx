import { createSignal, ParentComponent, Show } from 'solid-js';
import { Transition } from 'solid-transition-group';

import Icon from './Icon';

interface Props {
    onDropFiles: (files: Track[]) => void;
}

const readEntriesPromise = async (
    directoryReader: FileSystemDirectoryReader
): Promise<FileSystemEntry[]> => {
    try {
        return await new Promise((resolve, reject) =>
            directoryReader.readEntries(resolve, reject)
        );
    } catch (err) {
        console.log(err);

        return [];
    }
};

const readAllDirectoryEntries = async (
    directoryReader: FileSystemDirectoryReader
) => {
    let entries = [];

    let readEntries = await readEntriesPromise(directoryReader);

    while (readEntries.length > 0) {
        entries.push(...readEntries);
        readEntries = await readEntriesPromise(directoryReader);
    }

    return entries;
};

const getAllFileEntries = async (
    dataTransferItemList: DataTransferItemList
) => {
    let fileEntries = [];

    let queue: FileSystemEntry[] = [];

    for (const item of dataTransferItemList) {
        if (item) queue.push(item.webkitGetAsEntry());
    }

    while (queue.length > 0) {
        const entry = queue.shift();

        if (!entry) continue;

        if (entry.isFile) {
            fileEntries.push(entry as FileSystemFileEntry);
        } else if (entry.isDirectory) {
            queue.push(
                ...(await readAllDirectoryEntries(
                    (entry as FileSystemDirectoryEntry).createReader()
                ))
            );
        }
    }

    return fileEntries;
};

const getFileFromEntry = (entry: FileSystemFileEntry): Promise<File> =>
    new Promise((resolve, reject) => entry.file(resolve, reject));

const FileDrop: ParentComponent<Props> = (props) => {
    const [isDraggedOver, setIsDraggedOver] = createSignal(false);
    const [isProcessing, setIsProcessing] = createSignal(false);

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();

        if (!isDraggedOver()) setIsDraggedOver(true);
    };

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();

        setIsDraggedOver(false);
    };

    const handleDrop = async (e: DragEvent) => {
        e.preventDefault();

        const { items } = e.dataTransfer || {};

        if (!items) return;

        const entries = await getAllFileEntries(items);

        if (entries.length) {
            /* TODO: Filter unsupported file types */
            const filteredEntries = [];

            setIsProcessing(true);

            for (const entry of entries) {
                const { path, type } = await getFileFromEntry(entry);

                if (type.startsWith('audio/')) {
                    filteredEntries.push({
                        ...(await window.electron.getFileMetadata(path)),
                        source: `file://${path}`
                    });
                }
            }

            setIsDraggedOver(false);

            setIsProcessing(false);

            props.onDropFiles(filteredEntries);
        }
    };

    return (
        <div
            class="relative flex flex-col flex-grow"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {props.children}

            <Transition name="fade">
                <Show when={isDraggedOver()}>
                    <div class="absolute inset-0 bg-primary-800 bg-opacity-50 flex p-2">
                        <div class="flex flex-col flex-grow justify-center items-center border-2 border-dashed border-primary-100 border-opacity-50 rounded">
                            <Show
                                when={isProcessing()}
                                fallback={
                                    <>
                                        <Icon
                                            class="w-12 h-12 text-primary-100"
                                            name="file-add"
                                        />

                                        <p class="text-primary-100">
                                            Drop files here.
                                        </p>
                                    </>
                                }
                            >
                                <Icon
                                    class="w-12 h-12 text-primary-100"
                                    name="loading"
                                />

                                <p class="text-primary-100">
                                    Processing metadata...
                                </p>
                            </Show>
                        </div>
                    </div>
                </Show>
            </Transition>
        </div>
    );
};

export default FileDrop;
