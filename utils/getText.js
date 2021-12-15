export default () => {
    const texts = [
        'This is a short text.',
        'This is a medium sized text to write some words.',
        'This is an almost or kind of big text to write some words so we can test your skills.'
    ]

    return texts[Math.floor(Math.random()*texts.length)]
}