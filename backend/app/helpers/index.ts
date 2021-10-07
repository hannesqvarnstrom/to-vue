import { Request } from "express"

export const findToken = (req: Request): string => {
    let token = req.headers['x-access-token'] || req.headers['authorization'] || req.body.token

    if (!token)
        return ''

    if (token.indexOf('Bearer') !== -1)
        token = token.substr(7, token.length)

    return token
}

export const capitalize = (str: string) => str[0].toUpperCase() + str.substring(1)