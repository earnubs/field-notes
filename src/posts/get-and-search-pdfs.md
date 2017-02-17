---
title: Get and search PDFs from the web
draft: false 
publishedDate: 2016-07-06T16:39
---

This is to remind me how to grab a load of PDFs from a website and
do a text search on them: 

```
wget -r -A.pdf http://www.example.com/page-with-pdfs.htm
find . -name "*.pdf" -type f -exec pdftotext {} - \; | grep "thing to search for" -C5
```

Very useful for searching local council meeting minutes and planning applications!
