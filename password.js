const crypto = require('crypto');

function hasAtLeastOne(password, source) {
    return Boolean(
        password.split('').find(element => {
            return source.find(sourceElement => {
                return element === sourceElement;
            });
        })
    );
}

exports.generatePassword = (
    passLength = 15,
    hasPunctuation = false,
    hasUpper = true,
    hasNumbers = true
) => {
    const lower = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const characters = lower;
    const numbers = '0123456789'.split('');
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const punctuation = '?!,.:;'.split('');
    let password;
    let passwordRequirements = false;
    if (hasNumbers) {
        characters.push(...numbers);
    }
    if (hasPunctuation) {
        characters.push(...punctuation);
    }
    if (hasUpper) {
        characters.push(...upper);
    }
    while (!passwordRequirements) {
        password = '';
        const randomBuffer = crypto.randomBytes(passLength);
        for (let i = 0; i < randomBuffer.length; i += 1) {
            const index = randomBuffer[i] % characters.length;
            password += characters[index];
        }
        passwordRequirements = hasAtLeastOne(password, lower);
        if (hasNumbers) {
            passwordRequirements = passwordRequirements && hasAtLeastOne(password, numbers);
        }
        if (hasPunctuation) {
            passwordRequirements = passwordRequirements && hasAtLeastOne(password, punctuation);
        }
        if (hasUpper) {
            passwordRequirements = passwordRequirements && hasAtLeastOne(password, upper);
        }
    }

    return password;
};
