// themes/rogalunaTheme.js
import Quill from 'quill';

const SnowTheme = Quill.import('themes/snow');

class RogalunaTheme extends SnowTheme {
  constructor(quill, options) {
    super(quill, options);
  }

  
}

export default RogalunaTheme;
