---
title: Selenium-webdriver and HTTP CONNECT tunneling
publishedDate: 2017-02-17T21:43
subline: Boring tunnel machine. 
tags: selenium, testing
---

If you are running selenium-webdriver within an environment
that requires an HTTPS proxy to connect to the outside
world in order to drive your tests, such as when using the
[Browserstack](https://browserstack.com) webdriver hub, then
you may need to configure a webdriver proxy with an [HTTP CONNECT
tunneling](https://en.wikipedia.org/wiki/HTTP_tunnel#HTTP_CONNECT_tunneling)
[httpAgent](https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_Builder.html#usingHttpAgent),
like so:

```
import { Builder } from 'selenium-webdriver';
import { httpsOverHttp } from 'tunnel-agent';
import url from 'url';

# other stuff ...
const proxyUrl = url.parse(process.env.HTTP_PROXY);

driver = new Builder()
  .usingServer('https://hub.browserstack.com/wd/hub')
  .withCapabilities({ ... })
  .usingHttpAgent(httpsOverHttp({
    proxy: {
      host: proxyUrl.hostname,
      port: proxyUrl.port
    }
  }))
  .build();
```
