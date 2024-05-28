module.exports = {
    apps: [
        {
            name: "gestion-client",
            script: "./dist/serveur.js",
            watch: true,
            env: {
                NODE_ENV: "development"
            },
            env_production: {
                NODE_ENV: "production"
            }
        }
    ]
};
