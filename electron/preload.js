const replaceText = (selector, text) => {
    const element = document.getElementById(selector);

    if (element) element.innerText = text;
};

window.addEventListener('DOMContentLoaded', () => {
    for (const dependency of ['chrome', 'node', 'electron']) {
        const {
            versions: { [dependency]: version }
        } = process;

        if (version) replaceText(`${dependency}-version`, version);
    }
});
