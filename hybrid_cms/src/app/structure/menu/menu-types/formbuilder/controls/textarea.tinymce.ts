import controlTextarea from './textarea';
import { TextareaService } from './textarea.service';

/**
 * TinyMCE editor element
 * See https://www.tinymce.com/ for more info
 *
 * To customise the options on this editor, simply pass any properties you wish to overwrite in the controlConfig option to formRender
 * e.g. the below example would disable the ability to paste images as a base64 encoded src
 * ```
 * var renderOpts = {
 *    controlConfig: {
 *      'textarea.tinymce': {
*         paste_data_images: false
*       }
 *    }
 * };
 * ```
 */
export default class controlTinymce extends controlTextarea {
    field: any;
    editorOptions: any;
    static textareaService = new TextareaService();

  /**
   * configure the tinymce editor requirements
   */
  configure() {
    // this.js = ['//cdn.tinymce.com/4/tinymce.min.js', '/assets/vendors/by_hands/tinymce/example.plugin.min.js'];

    // 
    this.js = ['https://cdn.rawgit.com/frank-belldev/mytinymce/master/tinymce.js'];

    // additional javascript config
    if (this.classConfig.js) {
      let js = this.classConfig.js;
      if (!Array.isArray(js)) {
        js = new Array(js);
      }
      this.js.concat(js);
      delete this.classConfig.js;
    }

    // additional css config
    if (this.classConfig.css) {
      this.css = this.classConfig.css;
    }

    // configure the tinyMCE editor defaults
    this.editorOptions = {
      setup: (editor) => {
        editor.on('blur', evt => {
            if (this.field == undefined)
              this.field = [];
            if (editor == undefined)
              return;
            //this.editorOptions["target"]["value"] = editor["iframeElement"]["contentDocument"]["children"][0]["children"][1]["innerHTML"];
            let attrs = this.editorOptions["target"].parentNode.parentNode.parentNode.querySelectorAll('[class*="fld-value"]')
            attrs[0]["value"] = editor["iframeElement"]["contentDocument"]["children"][0]["children"][1]["innerHTML"];
        });
      },
      height: 250,
      paste_data_images: true,
      fontsize_formats: '8px 10px 12px 14px 18px 24px 36px',
      plugins: [
        'advlist autolink lists link image charmap preview anchor textcolor colorpicker',
        'searchreplace visualblocks fullscreen',
        'insertdatetime media table contextmenu paste html'
      ],
      toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | table | forecolor backcolor | fontsizeselect | html'
    };
  }


  /**
   * build a textarea DOM element, to be later replaced by the TinyMCE editor
   * @return {Object} DOM Element to be injected into the form.
   */
  build() {
    let {value = '', ...attrs} = this.config;
    this.field = this.markup('textarea', this.parsedHtml(value), attrs);
    return this.field;
  }

  /**
   * When the element is rendered into the DOM, execute the following code to initialise it
   * @param {Object} evt - event
   */
  onRender(evt) {
    // define options & allow them to be overwritten in the class config
    let options = $.extend(this.editorOptions, this.classConfig);
    options.target = this.field;

    if ((<any>window).tinymce.editors[this.id]) {
        (<any>window).tinymce.editors[this.id].remove();
        // (<any>window).tinymce.init(options);
    } else {
      // initialise the editor
      // (<any>window).tinymce.init(options);
    }
    (<any>window).tinymce.init(options);
    controlTinymce.textareaService.putQueue(options);
  }
}

// register tinymce as a richtext control
controlTextarea.register('textarea', controlTextarea);
controlTextarea.register('tinymce', controlTinymce, 'textarea');
controlTextarea.registerKinds(['standard', 'backpanel-inner'], controlTinymce, 'textarea');