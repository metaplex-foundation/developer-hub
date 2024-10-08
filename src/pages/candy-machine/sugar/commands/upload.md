---
title: upload
metaTitle: upload | Sugar
description: upload command.
---

The `upload`` command uploads assets to the specified storage and creates the cache file for the Candy Machine.

You upload all assets using the default asset folder location (e.g., `assets` folder on the current directory) with the following command:

```
sugar upload
```

Alternatively, you can specify a different folder:

```
sugar upload <ASSETS DIR>
```

{% callout %}

The `upload` command can be resumed (re-run) at any point in case the upload is not completed successfully — only files that have not yet been uploaded are processed. It also automatically detects when the content of media/metadata files changes and re-uploads them, updating the cache file accordingly. In other words, if you need to change a file, you only need to copy the new (modified) file to your assets folder and re-run the upload command. There is no need to manually edit the cache file.

{% /callout %}

## Example Images and Metadata

To access example images and metadata for your Candy Machine, visit our GitHub repository and download the zip file by clicking the green `code` button and selecting `Download ZIP`.

[https://github.com/metaplex-foundation/example-candy-machine-assets](https://github.com/metaplex-foundation/example-candy-machine-assets)

If you have Git installed, you can also clone the repository to your system or download a zip copy using the following command:

```
git clone https://github.com/metaplex-foundation/example-candy-machine-assets.git
```