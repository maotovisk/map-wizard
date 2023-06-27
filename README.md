<p align="center"><img src="app-icon.png" alt="logo" width="200"/></p>

# Hitsound Copier

<img align="right" src="https://github.com/maotovisk/hitsound-copier/assets/20617307/9f6e99dc-9d95-4413-b204-171ccf5bc5fd" alt="preview" width="400"/>
Cross platfrom hitsound copier for osu! standard beatmaps (for now) written in TypeScript, using osu!lazer's hitsound logic as base. It was done so we could have a hitsound copier solution that was friendly to run on Linux without the need of third party tools.

<br/>
<br/>

### Built with

- Tauri
- TypeScript
- [osu-parsers](https://github.com/kionell/osu-parsers)

<br/>

## Running

If you wish to run the project on your local machine, follow the instructions below:

Requirements

- [NodeJS](https://nodejs.org/en) (18 or higher)
- [pnpm](https://pnpm.io/)

### 1. Clone the project


```bash
git clone https://github.com/maotovisk/hitsound-copier.git
```

### 2. Install the project's dependencies;

```bash
pnpm install 
# pnpm i
```

### 3. Run the project

```bash
pnpm tauri dev
```

## TODOs

- Add map cleaner funcionality.
- Fix some extra greenlines being generated.
- Release to flathub.
