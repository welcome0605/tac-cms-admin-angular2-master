/* 
    Author     : Tomaz Dragar
    Mail       : <tomaz@dragar.net>
    Homepage   : http://www.dragar.net
*/

(function ($) {

    $.fn.simpleCropper = function (ForceX,ForceY) {
        reset();

        var image_dimension_x = 600;
        var image_dimension_y = 600;
        var scaled_width = 0;
        var scaled_height = 0;
        var x1 = 0;
        var y1 = 0;
        var x2 = 0;
        var y2 = 0;
        // var current_image = null;
        var image_filename = null;
        var aspX = 1;
        var aspY = 1;
        // var file_display_area = null;
        var ias = null;
        var original_data = null;
        // var jcrop_api = null;
        var element = null;
        // var bottom_html = "<input type='file' id='fileInput' name='files[]'/ accept='image/*'><canvas id='myCanvas' style='display:none;'></canvas><div id='modal'></div><div id='preview'><div class='buttons'><div class='cancel'></div><div class='ok'></div></div></div>";
        // $('body').append(bottom_html);
        $(this).attr('id', 'image-dropify-' + Math.random());
        window.currentCropper = $(this);
        window.current_image = null;
        window.lastImageBuffer = null;
        
        window.lastImageBuffer = window.currentCropper.parent().find('.dropify-preview .dropify-render img');
        
        element = window.currentCropper.parent().find('input').eq(0);
        imageUpload($('#preview').get(0));
        window.currentCropper.val("");
        //add click to element
        this.on('change',function () {
            aspX = window.currentCropper.width();
            aspY = window.currentCropper.height();
            window.file_display_area = window.currentCropper.parent().find('.dropify-preview .dropify-render ');
            element.val("");
            // $('#fileInput').click();
        });

        $('.ok').click((event) => {
            if ((this[0].id != window.currentCropper[0].id) || (window.currentCropper.parent().find('input').eq(0)[0] != element[0]))
                return;
            preview();
            $('#preview').delay(100).hide();
            $('#modal').hide();
            if (window.jcrop_api != null) {
                window.jcrop_api.destroy();
            }
            element.val("");
            element[0].isChanged = true;
            var event = new Event('changed');
            element[0].dispatchEvent(event);
            // reset();
        });

        //cancel listener
        $('.cancel').click(function (event) {
            $('#preview').delay(100).hide();
            $('#modal').hide();
            if (window.jcrop_api != null) {
                window.jcrop_api.destroy();
            }
            window.file_display_area = window.currentCropper.parent().find('.dropify-preview .dropify-render ');
            window.file_display_area.html('');
            window.file_display_area.append(window.lastImageBuffer);
            element.val("");
            // reset();
        });

        function reset() {
            scaled_width = 0;
            scaled_height = 0;
            x1 = 0;
            y1 = 0;
            x2 = 0;
            y2 = 0;
            window.current_image = null;
            image_filename = null;
            original_data = null;
            aspX = 1;
            aspY = 1;
            window.file_display_area = null;
            window.currentCropper = null;
        }

        function imageUpload(dropbox) {
            var file = element.get(0).files[0];

            var imageType = /image.*/;

            

            if (file.type.match(imageType)) {
                var reader = new FileReader();
                image_filename = file.name;

                reader.onload = function (e) {
                    // Clear the current image.
                    $('#photo').remove();

                    original_data = reader.result;

                    // Create a new image with image crop functionality
                    window.current_image = new Image();
                    window.current_image.src = reader.result;
                    window.current_image.id = "photo";
                    window.current_image.style['maxWidth'] = image_dimension_x + 'px';
                    window.current_image.style['maxHeight'] = image_dimension_y + 'px';
                    window.current_image.onload = function () {
                        // Calculate scaled image dimensions
                        if (window.current_image.width > image_dimension_x || window.current_image.height > image_dimension_y) {
                            if (window.current_image.width > window.current_image.height) {
                                scaled_width = image_dimension_x;
                                scaled_height = image_dimension_x * window.current_image.height / window.current_image.width;
                            }
                            if (window.current_image.width < window.current_image.height) {
                                scaled_height = image_dimension_y;
                                scaled_width = image_dimension_y * window.current_image.width / window.current_image.height;
                            }
                            if (window.current_image.width == window.current_image.height) {
                                scaled_width = image_dimension_x;
                                scaled_height = image_dimension_y;
                            }
                        }
                        else {
                            scaled_width = window.current_image.width;
                            scaled_height = window.current_image.height;
                        }

                        // set the image size to the scaled proportions which is required for at least IE11
                        window.current_image.style['width'] = scaled_width + 'px';
                        window.current_image.style['height'] = scaled_height + 'px';

                        // Position the modal div to the center of the screen
                        $('#modal').css('display', 'block');
                        var window_width = $(window).width() / 2 - scaled_width / 2 + "px";
                        var window_height = $(window).height() / 2 - scaled_height / 2 + "px";

                        // Show image in modal view
                        $("#preview").css("top", window_height);
                        $("#preview").css("left", window_width);
                        $('#preview').show(500);


                        // Calculate selection rect
                        var selection_width = 0;
                        var selection_height = 0;

                        var max_x = Math.floor(scaled_height * aspX / aspY);
                        var max_y = Math.floor(scaled_width * aspY / aspX);


                        if (max_x > scaled_width) {
                            selection_width = scaled_width;
                            selection_height = max_y;
                        }
                        else {
                            selection_width = max_x;
                            selection_height = scaled_height;
                        }

                        ias = $(this).Jcrop({
                            onSelect: showCoords,
                            onChange: showCoords,
                            bgColor: '#747474',
                            bgOpacity: .25,
                            aspectRatio: ForceX / ForceY,
                            setSelect: [0, 0, selection_width, selection_height]
                        }, function () {
                            window.jcrop_api = this;
                        });
                    }

                    // Add image to dropbox element
                    dropbox.appendChild(window.current_image);
                }

                reader.readAsDataURL(file);
            } else {

            }
        }

        function showCoords(c) {
            x1 = c.x;
            y1 = c.y;
            x2 = c.x2;
            y2 = c.y2;
        }

     

        function ReSizeBase64Image (base64,startX,startY,ImgWidth,ImgHeight, maxWidth, maxHeight) {
          // Max size for thumbnail
            if(typeof(maxWidth) === 'undefined')  maxWidth = 500;
            if(typeof(maxHeight) === 'undefined')  maxHeight = 500;
          
            // Create and initialize two canvas
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            var canvasCopy = document.createElement("canvas");
            var copyContext = canvasCopy.getContext("2d");

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            copyContext.clearRect(0, 0, canvas.width, canvas.height);
            if (typeof(base64) == 'undefined') {
              return;
            }
            // Create original image
            var img = new Image();
            img.src = base64;
          
            var ratio = 1;

            canvasCopy.width = img.width;
            canvasCopy.height = img.height;
            copyContext.drawImage(img, 0, 0);
          
            // Copy and resize second canvas to first canvas
            // canvas.width = img.width * ratio;
            // canvas.height = img.height * ratio;
            canvas.width = maxWidth;
            canvas.height = maxWidth * ImgHeight / ImgWidth;
            ctx.drawImage(canvasCopy, startX, startY, ImgWidth, ImgHeight, 0, 0, canvas.width, canvas.height);
            return canvas.toDataURL();
          }

        $(window).resize(function () {
            // Position the modal div to the center of the screen
            var window_width = $(window).width() / 2 - scaled_width / 2 + "px";
            var window_height = $(window).height() / 2 - scaled_height / 2 + "px";

            // Show image in modal view
            $("#preview").css("top", window_height);
            $("#preview").css("left", window_width);
        });



        function preview() {
            // Set selection width and height
            var sw = x2 - x1;
            var sh = y2 - y1;

            if (window.current_image == null) {
                return;
            }
            var imgWidth = window.current_image.naturalWidth;
            var imgHeight = window.current_image.naturalHeight;
            // Set selection koeficient
            var kw = imgWidth / $("#preview").width();
            var kh = imgHeight / $("#preview").height();

            // Set canvas width and height and draw selection on it
            var dataUrl = ReSizeBase64Image(window.current_image.src,(x1 * kw), (y1 * kh), (sw * kw), (sh * kh), ForceX, ForceY);
            // Convert canvas image to normal img

            // Append it to the body element
            $('#preview').delay(100).hide();
            $('#modal').hide();
            
            var img = new Image();
            img.src = dataUrl;
            window.file_display_area = window.currentCropper.parent().find('.dropify-preview .dropify-render ');
            window.file_display_area.html('');
            window.file_display_area.append(img);
            //file_display_area.attr('src',dataUrl);

            // if (onComplete) onComplete(
            //     {                    
            //         "original": { "filename": image_filename, "base64": original_data, "width": current_image.width, "height": current_image.height },
            //         "crop": { "x": (x1 * kw), "y": (y1 * kh), "width": (sw * kw), "height": (sh * kh) }
            //     }
            //    );
        }



    }

    $.fn.converter2File = function () {
        var base64 = $(this).parent().find('.dropify-preview .dropify-render img:first').attr('src')
        // separate out the mime component
        var byteString = atob(base64.split(',')[1]);
        var mimeString = base64.split(',')[0].split(':')[1].split(';')[0]
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([ia.buffer], {type: mimeString});
        return blob;
    }

    $.fn.converter2Base64 = function(self = false) {
        var findArea = null;
        if (self)
        {
            findArea = $(this);
        } else {
            findArea = $(this).parent();
        }
        var base64 = findArea.find('.dropify-preview .dropify-render img:first').attr('src');
        if (!base64 || !base64.startsWith('data:image'))
            return null;
        var base64File = base64.split(',')[1];
        return base64File;
    }

}(jQuery));
