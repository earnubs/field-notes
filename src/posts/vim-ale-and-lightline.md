---
title: Vim, ALE and lightline-ale
publishedDate: 2018-03-06T19:04
subline: Linting and auto-fixing with Vim.
tags: vim
---

ALE is a plugin for Vim 8 that provides linting while you edit, and
where the linter in use supports autofixing ALE will do that for you too,
or we can specify an alternate for the fixing. Read more about ALE here:
https://github.com/w0rp/ale

The default linter for JSON is jsonlint,
https://github.com/zaach/jsonlint, which doesn't come with any options
to fix lint errors, but we can install fixjson to handle that for us
https://github.com/rhysd/fixjson, all together:

```
npm install -g jsonlint fixjson
```

and in .vimrc:

```
let g:ale_fixers = {}
let g:ale_fixers['json'] = ['fixjson']
```

Another option here would be to use prettier, which lints and fixes,
but that would be too easy, and defeat the purpose of this post; read
more about prettier here https://github.com/prettier/prettier

This is incredibly useful to me as I spend a lot of time in JSON configs
and whatnot, and in Vim I have auto lint fixing mapped to <kbd>space</kbd>
<kbd>d</kbd>, so it's very simple to fix any errors, again in
.vimrc:

```
" set the leader to <space>
:let mapleader = " " 
nmap <leader>d <Plug>(ale_fix)
```

Finally, as the cherry on the cake to all that, I have lightline.vim
installed which adds some simple status line messages to my Vim window,
https://github.com/itchyny/lightline.vim, and which also has available an
ALE plugin to show lint status https://github.com/maximbaz/lightline-ale.
Install as per the instructions in the link but note that the config
should start with:

```
let g:lightline = {}
```

For more on the leader in Vim read http://learnvimscriptthehardway.stevelosh.com/chapters/06.html
