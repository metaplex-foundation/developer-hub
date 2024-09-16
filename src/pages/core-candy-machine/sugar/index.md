---
title: Sugar for Core Candy Machine
metaTitle: Sugar for Core Candy Machine | Core Candy Machine
description: Learn about Sugar CLI which makes creating and deploying Core Candy Machines effortless.
---

## Using Sugar

Sugar is a CLI based tool that abstracts some of the complexity of a Candy Machine deployment and management into an easy to use CLI tool.

The main areas of abstraction the Sugar CLI helps with are:

- Uploading files to a decentralised storage system
- Inserting all items into the Core Candy Machine.

## Commands

Sugar CLI comes with executable commands for each stage of creation and management including:

### LFG

An all in one command that executes each stage including:

- Collection Creation
- Uploading Assets
- Creating Core Candy Machine
- Inserting Items into Core Candy Machine

This command is great for generating a fresh new deployment for a project.

Each stage of the process is writen and stored to the `cache.json` file.

```shell
sugar lfg
```

### Collection

Creates a Core Collection based on the `collection.png`/`collection.jpg` and `collection.json` stored in the root of the `assets` folder.
The resulting Core Collection creation is stored in the `cache.json` file.

```shell
sugar collection
```

### Upload

Validates and uploads all files in the `assets/images` and `assets/metadata` folders to Arweave while also writing image uri data to all the metadata files.
The resulting uploads is stored in the `cache.json` file.

```shell
sugar upload
```

### Create

#### Requirements

- `collection` to have already been run and generated to the `cache.json` file.

Validates and uploads all files in the `assets/images` and `assets/metadata` folders to Arweave while also writing image uri data to all the metadata files.
The resulting uploads is stored in the `cache.json` file.

```shell
sugar upload
```

## Assets Folder

When executing commands such as `upload` Sugar will expecting to find an `assets` folder in the directory you are launching the command from.

The folder structure Sugar will expect is the following:

```
assets/
├─ images/
├─ metadata/
```

#### File Naming

Images and Metadata JSON files are expected to follow an incremental index naming convention starting from 0.

If any indices are missed of if the `image` and `metadata` folders do not include the same amount of files then folder validation will fail.

```
assets/
├─ images/
│  ├─ 0.png
│  ├─ 1.png
│  ├─ 2.png
│  ├─ ...
├─ metadata/
│  ├─ 0.json
│  ├─ 1.json
│  ├─ 2.json
│  ├─ ...
```

