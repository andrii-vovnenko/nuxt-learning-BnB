export default (count, word) => {
    const text = `${count} ${word}`;
    if (Number(count) === 1) return text;
    return `${text}s`;
};