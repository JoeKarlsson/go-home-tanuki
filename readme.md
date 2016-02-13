# Go Home Tankuki (You're Drunk)
### A Phaser.js game

The fox-like Tanuki often appears in Japanese folklore as a shape-shifter with supernatural powers and mischievous tendencies, and is the protagonist of our game.

Go Home Tanuki (You're Drunk) was created at Global Game Jam 2016 and uses the theme "Ritual" to exemplify the results of a demanding work ethic common in Japan. Tanuki spends his days working, drinking, going home, repeat - and the player's job is to make sure he gets home safely, at least for tonight.

You can play the game [here](https://go-home-tanuki.herokuapp.com/)

!['Tanuki'](http://49.media.tumblr.com/1f54a0a8c9086a95b2438edcc68cf7b9/tumblr_mnbosfY7oz1roqda3o1_500.gif)

### Game Shots

![Imgur](http://i.imgur.com/i6F8OoS.png)

![Imgur](http://i.imgur.com/0dQ6Z5k.png)

[Check out out our gameplay footage here](https://youtu.be/7DED6sdNvCY)

## Installing

### Node.js and Grunt

You will need to first install [Node.js](http://nodejs.org/download/) and the grunt-cli: `npm install -g grunt-cli`.

### Setup Your Project

Download and unpack [Go Home Tanuki](https://github.com/JoeKarlsson1/go-home-tanuki). Or alternatively checkout from source:

    git clone https://github.com/JoeKarlsson1/go-home-tanuki
    cd go-home-tanuki

Next, inside the project, you need to install the project's various NPM dependencies:

    npm install

And you should now be ready to spin up a development build of your new project:

    grunt

##Updating Code from GitHub
Navigate to the game directory in terminal ```cd Desktop/bechdel-test```
If you don't care about any local changes and just want a copy from the repo:

```git fetch --all```
```git pull```

Your code should now be up to date! ;)

##Contributing
1. Fork it!
2. Create your feature branch: ```git checkout -b my-new-feature```
3. Commit your changes: ```git commit -am 'Add some feature'```
4. Push to the branch: ````git push origin my-new-feature````
5. Submit a pull request :D

### Recommendations

* Use relative file paths for any assets loaded by your HTML or JavaScript. This will negate any potential path issues when the game is later uploaded to a webserver.
* If you intend to store development assets (i.e PSD's, Texture Packer files, etc) inside your project, store them outside of the `src` directory to avoid bloating your builds with them.
* Borwserify is crazy powerful. I'm not going to quote Spiderman, but you should definitely check out [Substack's Browserify Handbook](https://github.com/substack/browserify-handbook).
* Linting is disabled by default, if you'd like to enforce it for production builds update the `.jshintrc` with rules for your coding style and remove the comment block from jshint directive in the gruntfile's build task.

## What's in the Box

[NPM](https://www.npmjs.org/) via [Browserify](http://browserify.org/), [Jade](http://jade-lang.com/), [Stylus](http://learnboost.github.io/stylus/), [Lodash](http://lodash.com/), [JsHint](http://www.jshint.com/), [Uglify.js](https://github.com/mishoo/UglifyJS), [Source maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/), [Stats.js](https://github.com/mrdoob/stats.js/), [Google Analytics](http://www.google.com/analytics/), [Image optimisation tools](http://pngquant.org/), Livereload (auto refresh), Cache busted assets (WIP), Zip compression, [.gitignore](https://github.com/serby/GitIgnore)

### Available Targets

#### `grunt`

Configures and runs an unminified development build optimised for fast watch performance with source maps and live reload.

#### `grunt build`

Creates an uglified, production ready build with no source maps.

#### `grunt optimise`

Lossy compression of all png's in the `src/images/` directory using [pngquant](http://pngquant.org/).

(Linux users will need to have a version of pngquant available on their paths.)

#### `grunt zip`

Compiles the current build into `{title}.zip` with an internal folder. This is intended for use when transferring the build to a third party for webserver upload.

#### `grunt cocoon`

Compiles the current build into `{title}.zip` ready for upload to [CocoonJs](https://www.ludei.com/cocoonjs/).

### Updating or Adding Libraries

The project comes with an unminified version of Phaser with arcade physics, this can be replaced if you require updates or one of the alternate physics engines.

When adding new libraries that aren't CommonJS compatible, you'll have to update the [Browserify Shim configuration](https://github.com/thlorenz/browserify-shim#3-provide-browserify-shim-config).

### Coding Style and Linting

I follow [Ben Gourley's JavaScript Style Guide](https://github.com/bengourley/js-style-guide) (with the exception of using semicolons). I've kept the code footprint low so you can easily include your own `.jshintrc`.

## Created by

  * [Joe Carlson](http://www.callmejoe.net/)
  * [Corina Jacobson](https://github.com/corinajacobson)
  * [Sarah Kurisu](https://github.com/skurisu)
  * [Kent Salcedo](https://github.com/kentsalcedo)

!['Imgur'](http://i.imgur.com/Rulmw1r.jpg)

## Art by

  * [Bao Nyugen]()
  * [Gabe]()

!['Artist Photos'](http://i.imgur.com/u9eqbOJ.jpg)

##License
The MIT License (MIT)

Copyright (c) 2015 Joseph Carlson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
