interface userSchema {
    newName: string,
    newEmail: string,
    newPassword: string
}

interface decoded_JWT {
    userDetails: userSchema,
    otp: number
}

export default decoded_JWT;