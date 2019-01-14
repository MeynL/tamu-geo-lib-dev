<p align="center">
  <img height="256px" width="256px" style="text-align: center;" src="https://cdn.rawgit.com/MeynL/MeynL/master/demo/src/assets/logo.svg">
</p>

# MeynL - Angular library built with ❤ using ngx-library yeoman generator.

[![npm version](https://badge.fury.io/js/MeynL.svg)](https://badge.fury.io/js/MeynL),
[![Build Status](https://travis-ci.org/MeynL/MeynL.svg?branch=master)](https://travis-ci.org/MeynL/MeynL)
[![Coverage Status](https://coveralls.io/repos/github/MeynL/MeynL/badge.svg?branch=master)](https://coveralls.io/github/MeynL/MeynL?branch=master)
[![dependency Status](https://david-dm.org/MeynL/MeynL/status.svg)](https://david-dm.org/MeynL/MeynL)
[![devDependency Status](https://david-dm.org/MeynL/MeynL/dev-status.svg?branch=master)](https://david-dm.org/MeynL/MeynL#info=devDependencies)

## Demo

View all the directives in action at https://MeynL.github.io/MeynL

## Dependencies
* [Angular](https://angular.io) (*requires* Angular 2 or higher, tested with 2.0.0)

## Installation
Install above dependencies via *npm*. 

Now install `tamu-geo-lib` via:
```shell
npm install --save tamu-geo-lib
```

---
##### SystemJS
>**Note**:If you are using `SystemJS`, you should adjust your configuration to point to the UMD bundle.
In your systemjs config file, `map` needs to tell the System loader where to look for `tamu-geo-lib`:
```js
map: {
  'tamu-geo-lib': 'node_modules/tamu-geo-lib/bundles/tamu-geo-lib.umd.js',
}
```
---

Once installed you need to import the main module:
```js
import { LibModule } from 'tamu-geo-lib';
```
The only remaining part is to list the imported module in your application module. The exact method will be slightly
different for the root (top-level) module for which you should end up with the code similar to (notice ` LibModule .forRoot()`):
```js
import { LibModule } from 'tamu-geo-lib';

@NgModule({
  declarations: [AppComponent, ...],
  imports: [LibModule.forRoot(), ...],  
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

Other modules in your application can simply import ` LibModule `:

```js
import { LibModule } from 'tamu-geo-lib';

@NgModule({
  declarations: [OtherComponent, ...],
  imports: [LibModule, ...], 
})
export class OtherModule {
}
```

## Usage



## License

Copyright (c) 2019 MeynL. Licensed under the MIT License (MIT)

