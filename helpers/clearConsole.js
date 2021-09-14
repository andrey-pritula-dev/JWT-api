module.exports.clear = () => {
    process.stdout.cursorTo(0,0);
    process.stdout.clearScreenDown();
}
