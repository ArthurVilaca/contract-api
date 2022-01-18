function profileFormatter(profile, paid) {
    console.log(paid)
    const {
        id,
        firstName,
        lastName
    } = profile;
    return {
        id,
        fullName: [firstName, lastName].join(' '),
        paid
    }
}

module.exports = {
    profileFormatter
}