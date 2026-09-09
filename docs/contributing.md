# Contributing

We welcome contributions to StellarYard! This page covers how to contribute to the documentation and the codebase.

## Contributing to the Docs

### Local Development

```bash
cd stellaryard-docs
pip install mkdocs mkdocs-material
mkdocs serve
```

Open `http://localhost:8000` to preview changes.

### Adding a Page

1. Create a new `.md` file in `docs/`
2. Add it to the `nav` section in `mkdocs.yml`
3. Preview with `mkdocs serve`
4. Submit a PR

### Writing Style

- Use clear, direct language
- Include code examples for every concept
- Use admonitions for warnings and tips
- Keep pages focused on one topic

## Contributing to Code

See the CONTRIBUTING.md in each repo:

- [stellaryard-core](https://github.com/StellarYard/stellaryard-core/blob/main/CONTRIBUTING.md)
- [stellaryard-cli](https://github.com/StellarYard/stellaryard-cli/blob/main/CONTRIBUTING.md)
- [stellaryard-dashboard](https://github.com/StellarYard/stellaryard-dashboard/blob/main/CONTRIBUTING.md)

## Finding Work

- Check [open issues](https://github.com/StellarYard/stellaryard-core/issues) for `ready` tasks
- Issues labeled `good-first-issue` are ideal for first-time contributors

## Code of Conduct

Be respectful, constructive, and professional. We're building tools for the Stellar ecosystem together.

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.
