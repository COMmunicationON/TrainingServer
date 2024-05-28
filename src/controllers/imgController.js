const imagePath = `${process.env.IMAGE_URL}`

const imgs = {
    'ㅏ': [`${imagePath}/ㅏ.png`],
    'ㅐ': [`${imagePath}/ㅐ.png`],
    'ㅑ': [`${imagePath}/ㅑ.png`],
    'ㅒ': [`${imagePath}/반모음.png`, `${imagePath}/ㅐ.png`],
    'ㅓ': [`${imagePath}/ㅓ.png`],
    'ㅔ': [`${imagePath}/ㅔ.png`],
    'ㅕ': [`${imagePath}/반모음.png`, `${imagePath}/ㅓ.png`],
    'ㅖ': [`${imagePath}/반모음.png`, `${imagePath}/ㅔ.png`],
    'ㅗ': [`${imagePath}/ㅗ.png`],
    'ㅘ': [`${imagePath}/ㅗ.png`, `${imagePath}/ㅏ.png`],
    'ㅙ': [`${imagePath}/ㅜ.png`, `${imagePath}/ㅐ.png`],
    'ㅚ': [`${imagePath}/ㅜ.png`, `${imagePath}/ㅐ.png`],
    'ㅛ': [`${imagePath}/반모음.png`, `${imagePath}/ㅗ.png`],
    'ㅜ': [`${imagePath}/ㅜ.png`],
    'ㅝ': [`${imagePath}/ㅜ.png`, `${imagePath}/ㅓ.png`],
    'ㅞ': [`${imagePath}/ㅜ.png`, `${imagePath}/ㅐ.png`],
    'ㅟ': [`${imagePath}/ㅜ.png`, `${imagePath}/ㅣ.png`],
    'ㅠ': [`${imagePath}/반모음.png`, `${imagePath}/ㅜ.png`],
    'ㅡ': [`${imagePath}/ㅡ.png`],
    'ㅢ': [`${imagePath}/ㅡ.png`, `${imagePath}/ㅣ.png`],
    'ㅣ': [`${imagePath}/ㅣ.png`],
    'ㅁ': [`${imagePath}/ㅁ.png`],
    'ㅂ': [`${imagePath}/ㅁ.png`],
    'ㅃ': [`${imagePath}/ㅁ.png`],
    'ㅍ': [`${imagePath}/ㅁ.png`]
}

exports.getImagePaths = (sound) => {
    return imgs[sound] || [];
}
