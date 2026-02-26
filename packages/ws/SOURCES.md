# Sources: ws

## Official Documentation
- npm: https://www.npmjs.com/package/ws
- GitHub: https://github.com/websockets/ws

## Behavioral Evidence

### Error Events
The WebSocket class emits 'error' events on connection failures and the `send()` method can throw if the connection is not in OPEN state.

Reference: Package README and API documentation.
