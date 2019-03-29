/**
 * Slideshow input class
 * Output a <input type="slideshow" ... /> form element
 */

import {control} from "../control";

export default class controlSlideshow extends control {

  private fineTemplate: any;
  private adderTemplate: any;
  private wrapper: any;

  private image_sources: {[key: string]: string} = {};

  static get definition() {
    return {

      // mi18n custom mappings (defaults to camelCase type)
      mi18n: {
        slideshow: 'Slideshow'
      }
    };
  }

  static preProcess(field, previewData) {
    $('.dropify-render img', field).toArray().forEach(img => {
      let src = (<HTMLImageElement>img).src;
      let imageDropify = $(img).closest('.image-dropify');
      (<HTMLInputElement>$(`.image-source[name='${imageDropify[0].id.split("-wrapper")[0]}']`)[0]).setAttribute('value', src);
    });
  }

  configure() {
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
    this.adderTemplate = `
        <div class="adder-inner-wrapper" data-height="140">
          <div class="round">+</div>
        </div>
    `;

    this.image_sources = {};
  }

  /**
   * build a slideshow input dom element
   * @return {Object} DOM Element to be injected into the form.
   */
  build() {
    let images = [];
    let {values, ...data} = this.config;
    let imageType = 'text';
    if (values) {
      for ( let i = 0; i < values.length; i++) {
        let image = values[i];

        let {source, ...imageAttrs} = image;
        this.image_sources[`${imageAttrs.id}-wrapper`] = source;

        // let output = this.markup('input', null, Object.assign({}, data, imageAttrs));
        // let wrapper = this.markup('div', output, {className: 'slideshow-image'});
        let wrapper = this.markup('li', this.fineTemplate, {className: 'form-group image-dropify', id: imageAttrs.id + '-wrapper'});
        images.push(wrapper);
      }
    }
    let adder = this.markup('li', this.adderTemplate, {
      className: 'form-group image-adder'
    });
    images.push(adder);
    this.wrapper = this.markup('div', images, {className: 'slideshow'});
    return [this.wrapper];
  }

  /**
   * onRender callback
   */
  onRender() {
    let wrapper = $(this.wrapper);

    // we need to know where the server handler file located. I.e. where to we send the upload POST to?
    // to set this, define controlConfig.file.handler in the formbuilder options
    // defaults to '/upload'

    // deep copy merge in passed class configuration over any conflicting defaults
    let config = $.extend(true, {
      // defaultFile: this.SettingData['Rewards_Card']['Background_Image'],
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

    // (<any>jQuery('.sortable-options', $li)).sortable({update: () => h.updatePreview($li)});

    wrapper.sortable({
        cursor: "move",
        opacity: 0.9,
        revert: 150,
        items: "li.image-dropify",
        cancel: "li.image-adder"
    });

    (<any>$('li.image-adder', wrapper)).click(evt => {
      (<any>$('.add-slide-image', wrapper.closest('.slideshow-field'))).click();

      let lastImagePan = $('li.image-dropify:eq(-1)', wrapper);
      let newImagePan = this.markup('li', this.fineTemplate, {className: 'form-group image-dropify hidden', id: lastImagePan.attr('id').replace("-wrapper", "-image-wrapper") });
      $(evt.delegateTarget).before(newImagePan);

      let drEvent = (<any>$('input.dropify', newImagePan)).dropify(config);
      drEvent.change((evt) => {
        let imageDropify = (<any>$(evt.target).closest('.image-dropify'));
        let dropifyWrapper = (<any>$(evt.target).closest('.dropify-wrapper'));
        imageDropify.removeClass('hidden');
        dropifyWrapper.simpleCropper(1000, 600);
        imageDropify.trigger('imageChanged');
      });

      drEvent.on('dropify.beforeClear', (event, element) => {
        if ((<any>$('.dropify-wrapper.has-preview .dropify-clear', wrapper)).toArray().length <= 2) {
          event.stopPropagation();
          event.preventDefault();
          alert('Slideshow must have at least two images');
          return false;
        } else {
          return true;
        }
      });

      drEvent.on('dropify.afterClear', (event, element) => {
        let text_name = (<any>$(event.target).closest('.image-dropify')[0]).id.split('-wrapper')[0];
        $(`input[name='${text_name}']`)[0].setAttribute('value', '');
        $(`input[name='${text_name}']`).siblings("a.remove-slide-image").click();

      });

      (<any>$('input.dropify', newImagePan)).click();
    });    

    (<any>$('input.dropify', wrapper)).toArray().forEach(element => {
      let drEvent = (<any>$(element)).dropify($.extend({}, config, { defaultFile: this.image_sources[`${$(element).closest('.image-dropify')[0].id}`]}));
      drEvent.change((evt) => {
        let imageDropify = (<any>$(evt.target).closest('.image-dropify'));
        let dropifyWrapper = (<any>$(evt.target).closest('.dropify-wrapper'));
        dropifyWrapper.simpleCropper(500, 300);
        imageDropify.trigger('imageChanged');
      });

      drEvent.on('dropify.beforeClear', (event, element) => {
        if ((<any>$('.dropify-wrapper.has-preview .dropify-clear', wrapper)).toArray().length <= 2) {
          event.stopPropagation();
          event.preventDefault();
          alert('Slideshow must have at least two images');
          return false;
        } else {
          return true;
        }
      });

      drEvent.on('dropify.afterClear', (event, element) => {
        let text_name = (<any>$(event.target).closest('.image-dropify')[0]).id.split('-wrapper')[0];
        $(`input[name='${text_name}']`)[0].setAttribute('value', '');
        $(`input[name='${text_name}']`).siblings("a.remove-slide-image").click();

      });

    });

    setTimeout(() => {
      (<any>$('.adder-inner-wrapper', wrapper)).height($('.slideshow .dropify-wrapper:eq(0)')[0].style.height);
    }, 300);

    if (typeof($('#preview').html()) == 'undefined') {
      let bottom_html = "<input type='file' id='fileInput' name='files[]'/ accept='image/*'><canvas id='myCanvas' style='display:none;'></canvas><div id='modal'></div><div id='preview'><div class='buttons'><div class='cancel' style='background-size: 100% 100%;'></div><div class='ok' style='background-size: 100% 100%;'></div></div></div>";
      $('body').append(bottom_html);
    }
  }

}

// register the following controls
control.register('slideshow', controlSlideshow);
