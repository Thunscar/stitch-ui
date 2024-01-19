export const persistConfig = (key, paths) => {
    return {
        enabled: true,
        strategies: [
            {
                key: key,
                storage: localStorage,
                paths: paths
            },
        ],
    };
}