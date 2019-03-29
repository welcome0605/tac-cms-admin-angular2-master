import controlText from './text';

/**
 * Fineuploader class - render the fineuploader tool (https://fineuploader.com) in place of the traditional file upload widget
 * For assistance with further configuring Fine Uploader in your application, please refer to:
 * https://docs.fineuploader.com/branch/master/api/options-ui.html
 *
 * If you wish to use your own installation of fineuploader, refer to here:
 *   - https://docs.fineuploader.com/quickstart/01-getting-started.html
 *   - You can download from here: https://fineuploader.com/customize
 *   - You can specify the location of your javascript & css in opts.controlConfig.file
 *   - The 'js' option should point to the jquery.fine-uploader.min.js file (note this is the jQuery plugin version)
 *
 *   E.g. var opts = {
 *    // other formbuilder options here
 *
 *    controlConfig: {
 *      'file.fineuploader': {
 *        js: '/path/to/jquery.fine-uploader.min.js',
 *        css: '/path/to.css',
 *        handler: '/path/to/handler.php',
 *
 *        // other fine uploader configuration options here
 *      }
 *    }
 *  };
 *
 * This plugin is by default configured to use the 'Traditional' build, but you can easily reconfigure by passing appropriate Fine Uploader configuration options to controlConfig.file.
 * A simple php upload handler endpoint can be found here: https://github.com/FineUploader/php-traditional-server. To use this for your handler, simply set the controlConfig.fineuploader.handler option to be '/path/to/php-traditional-server/endpoint.php'
 *
 * If you wish to define a custom uploader handler URL, define controlConfig.file.handler in the formbuilder options. Defaults to /upload
 * If you wish to define a custom template for the interface, this can be defined in controlConfig.file.template. It defaults to the gallery template provided by the Fineuploader project
*/

export default class controlImage extends controlText {

    private handler: any | string;
    private input: any;
    private wrapper: any;
    private fineTemplate: any;

    private src = "";


  /**
   * Class configuration - return the icons & label related to this control
   * @return {Object} definition object
   */
  static get definition() {
    return {
      i18n: {
        default: 'Image Uploader'
      }
    };
  }

  static preProcess(field, previewData) {
    if ($('.dropify-render img', field)[0]) {
      previewData.src = (<HTMLImageElement>$('.dropify-render img', field)[0]).src; 
      (<HTMLInputElement>$('[class*="fld-src"]', field)[0]).setAttribute('value', previewData.src);
    } else {
      // previewData.src = '';
      // (<HTMLInputElement>$('[class*="fld-src"]', field)[0]).setAttribute('value', '');
    }
  }

  /**
   * configure the fineupload default settings & allow for controlConfig options
   */
  configure() {
    // this.js = this.classConfig.js || '//cdn.rawgit.com/JeremyFagis/dropify/master/dist/js/dropify.js';
    // this.css = [
    //   this.classConfig.css || '//cdn.rawgit.com/JeremyFagis/dropify/master/dist/css/dropify.css',
    // ];
    // this.handler = this.classConfig.handler || '/upload';
    // ['js', 'css', 'handler'].forEach(key => delete this.classConfig[key]);

    // fineuploader template that needs to be defined for the UI

    this.fineTemplate = this.classConfig.template || `
        <input type="file" accept="image/*"
        class="dropify"
        data-height="140"
        data-width="140"
        data-max-file-size="10M"
        data-allowed-file-extensions="png jpeg jpg"
        data-min-width="24" data-max-width="6000"
        data-min-height="24" data-max-height="6000"
        />`;
  }

  /**
   * build a div DOM element with id
   * @return {Object} DOM Element to be injected into the form.
   */
  build() {
    
    this.wrapper = this.markup('div', this.fineTemplate, {className: 'form-group image-dropify', id: this.config.name + '-wrapper'});
    this.input = this.markup('input', null, {type: 'hidden', name: this.config.name, id: this.config.name, value: this.src});

    // let wrapper = $(this.wrapper);
    // if ($('.dropify-render img', $(`#${this.config.name}-wrapper`))[0]) {
    //   // this.previewImageSrc = (<HTMLImageElement>$('.dropify-render img', $(`#${this.config.name}-wrapper`))[0]).src;
    //   this.config.src = (<HTMLImageElement>$('.dropify-render img', $(`#${this.config.name}-wrapper`))[0]).src;
    // }
    this.src = this.config.src;
    return [this.wrapper, this.input];
  }

  /**
   * onRender callback
   */
  onRender() {
    let wrapper = $(this.wrapper);
    let input = $(this.input);

    // we need to know where the server handler file located. I.e. where to we send the upload POST to?
    // to set this, define controlConfig.file.handler in the formbuilder options
    // defaults to '/upload'

    // deep copy merge in passed class configuration over any conflicting defaults
    let config = $.extend(true, {
      // defaultFile: this.SettingData['Rewards_Card']['Background_Image'],
      defaultFile: this.src,
      messages: {
        'default': 'Drag and drop a file here or click',
        'replace': 'Drag and drop or click to replace',
        'remove': 'Remove',
        'error': ''
      },
      error: {
        'fileSize': 'The file size is too big ({{ value }} max).',
        'minWidth': 'The image width is too small ({{ value }}px min).',
        'maxWidth': 'The image width is too big ({{ value }}px max).',
        'minHeight': 'The image height is too small ({{ value }}px min).',
        'maxHeight': 'The image height is too big ({{ value }}px max).',
        'imageFormat': 'The image format is not allowed ({{ value }} only).'
      },
      tpl: {
        wrap: '<div class="dropify-wrapper"></div>',
        loader: '<div class="dropify-loader"></div>',
        message: '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
        preview: '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
        filename: '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
        clearButton: '<button type="button" class="dropify-clear">{{ remove }}</button>',
        errorLine: '<p class="dropify-error">{{ error }}</p>',
        errorsContainer: '<div class="dropify-errors-container">Please upload image between 100 to 500 dimensions</div>'
      }
    }, this.classConfig);

    var drEvent =  (<any>$('input.dropify', wrapper)).dropify(config);
    drEvent.change(() => {
        (<any>wrapper).simpleCropper();
        wrapper.trigger('imageChanged');
    });

    drEvent.on('dropify.afterClear', (event, element) => {
        (<HTMLInputElement>$('[class*="fld-src"]', $('.file-field', event.target)[0])[0]).setAttribute('value', '');
    });

    $('input.dropify', wrapper).on('changed', evt => {
      
      console.log(evt.target);
      // $("body").trigger("imageChanged", {wrapper_id: (<any>$(evt.target).closest('[id*="preview-wrapper"]')[0]).id});
      // wrapper.trigger('imageChanged');
    });

    if (typeof($('#preview').html()) == 'undefined') {
      let bottom_html = "<input type='file' id='fileInput' name='files[]'/ accept='image/*'><canvas id='myCanvas' style='display:none;'></canvas><div id='modal'></div><div id='preview'><div class='buttons'><div class='cancel' style='background-size: 100% 100%;'></div><div class='ok' style='background-size: 100% 100%;'></div></div></div>";
      $('body').append(bottom_html);
    }
  }
}

// register fineuploader as a subtype to the 'file' type control (defined in text.js)
// also register the default file uploader as a subtype too so it appears in the dropdown

// controlText.register('file', controlText, 'file');
controlText.register('image', controlImage, 'file');
controlText.registerKinds(['standard', 'backpanel', 'fixed'], controlImage, 'file');
