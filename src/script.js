'use strict';

/**
 * Webpack entry point.
 *
 * The calculator logic lives in ../script.js so that index.html can load it
 * directly with a plain <script src="script.js"> tag during development, while
 * Webpack still bundles it from this file for distribution.
 */

require('../script.js');
