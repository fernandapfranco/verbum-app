// Metro precisa saber que arquivos .db são assets (o banco bíblico vai junto com o app).
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('db');
// expo-sqlite na web (apenas para testes no navegador) usa WebAssembly.
config.resolver.assetExts.push('wasm');

module.exports = config;
