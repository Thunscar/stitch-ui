import {JSEncrypt} from "jsencrypt";

const public_key = "-----BEGIN PUBLIC KEY-----\n" +
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4BIUJhBc0PkmSLUi10A1\n" +
    "tBa3ubd+ZNEDogehWcMSBgjo8oEbuY6xB+85KSKcyeOgcbEgtgNuJqLbc8in/BfK\n" +
    "CB8LoXm7Q21vXDNGv16TxsHQDbx10Pmmb510YoT/37tpefucq7OIzFZgoe3pbtLm\n" +
    "wpuNdfaIRYfY71kM2LvAsPLia6rRT6mE/u05aZrP0Mn8+0bv9Z4sTBYHvdi6hQJs\n" +
    "QPhjak7dzPWBt0jVuqh5rLXToexPxK8NxcuP+KRytnexiU+ITC3/W9XFLp4Ke9jS\n" +
    "AMU59jtigkRFqLuDwmAg5om9yTgZddMAvhNd1WQwGWxTo1Sygd+6Ly08mATtsd62\n" +
    "WQIDAQAB\n" +
    "-----END PUBLIC KEY-----"

const private_key = "-----BEGIN PRIVATE KEY-----\n" +
    "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDgEhQmEFzQ+SZI\n" +
    "tSLXQDW0Fre5t35k0QOiB6FZwxIGCOjygRu5jrEH7zkpIpzJ46BxsSC2A24mottz\n" +
    "yKf8F8oIHwuhebtDbW9cM0a/XpPGwdANvHXQ+aZvnXRihP/fu2l5+5yrs4jMVmCh\n" +
    "7elu0ubCm4119ohFh9jvWQzYu8Cw8uJrqtFPqYT+7Tlpms/Qyfz7Ru/1nixMFge9\n" +
    "2LqFAmxA+GNqTt3M9YG3SNW6qHmstdOh7E/Erw3Fy4/4pHK2d7GJT4hMLf9b1cUu\n" +
    "ngp72NIAxTn2O2KCREWou4PCYCDmib3JOBl10wC+E13VZDAZbFOjVLKB37ovLTyY\n" +
    "BO2x3rZZAgMBAAECggEAJGKLJwstJznt/4x6Vd21WsL9noivW4udPWhjyQGmIZi8\n" +
    "yvQwHlePY6xy6b0XHKl72jpbB3NTJa74V7rTnFn4ko0IBHaR9AcHOD+TU2v2LyY1\n" +
    "tKVPtFl1r1YwGfdi3V+/ZvF2pWMH6bZ1BpZte3N/yUYdGHSp+DBxB5y8O01xosng\n" +
    "H2NQxmfWXBG/CwLytIFCAI82gUkcMCoqQIMzWP0aVZzmKh8fWoVN7VRAGwiKAjfD\n" +
    "MsgWfV8tGOKXafNrwZUCabwA63SRjjbC6tC5Zh43IuQH8PinXzMpFTsWHuY5AMpu\n" +
    "SxYUOmZHTXSe593REYEpEPKOog7mlXYneIu6eSzBAQKBgQD7MX6lD8W8hIDUOSDs\n" +
    "PVTMWoq5m65fD8FjikD5oEXmUN5+pOJVrdglFzVhwqpNQX/u0laCK2qn5X130Oeq\n" +
    "R2uiEhgeS5w9ow8ArtLEqvG+yBsdnVx1ZHx458QqbCVx9+us77xhK+WN0W5m5wN1\n" +
    "DyaFwiuFu2FKLlZ2UWEomm7gEQKBgQDkW7g4hk9Xa0QNIKXSROSaeh7pN4vjJMu0\n" +
    "7Y5TuXk7WSV+aftKWvMDXRnROb7VgvulJYdvdT1pGSHG1YsXT+aU9N9/wvN+lncq\n" +
    "En5vE0HhA8MbyzeJ9mmjqEfzcAIz+8Pzj7hCpS6x6I6JOcyGhNrKgle1ZYNIA5yV\n" +
    "6EPDbx05yQKBgQD65fENhbeIGQFk+Lr9vDTa+QTfZ7S/lskfV5SWwZOP/O5/qMm5\n" +
    "sq7WPVxAjWP1TpsuPEHUOvGJShwMdUkwN642b8RPXk5s8lWl5Pj5H5XfbZhH+EnF\n" +
    "p9z8FuNFTEgKkguA7ORIWsQq5ylS9yPo5H0h1VQLe6ItqiMKgzZ8i+R7QQKBgQCy\n" +
    "bE+mKpr3jOIg969YeWe8o0pfonz0Px3DAhHArRxiGKdI/HnRgPp7WFUBuwK2RJ9m\n" +
    "S8pkddBDu9U+TD9fOZjKLgIrCyHBeMMm5khPdVZ1/8CEiOWeMCAeNS/yr0OpZj+W\n" +
    "oGax++peK3yjD7wUJt3keK8bFnPa4qeIIXBA1SKasQKBgAkCK96gvaclPuVt+nNN\n" +
    "R7M7ywQ8FFvmQxACiW5LJvxvUiPegrAcpR5CZhLYl+iAG4Ux76rsf8cUWv5QbN70\n" +
    "0OCK3zI994VEJXV4+SQsrFlDSWXexcDa3qjspTPXZmB/YHZbc3JTsGTpkP3U+Xl+\n" +
    "+KcZzjca35Pz+ml30R7sE3k7\n" +
    "-----END PRIVATE KEY-----"

export function encrypt(value) {
    const jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(public_key)
    return jsEncrypt.encrypt(value)
}

export function decrypt(value) {
    const jsEncrypt = new JSEncrypt();
    jsEncrypt.setPrivateKey(private_key)
    return jsEncrypt.decrypt(value)
}