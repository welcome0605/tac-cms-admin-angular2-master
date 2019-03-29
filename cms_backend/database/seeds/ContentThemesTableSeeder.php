<?php

use Illuminate\Database\Seeder;

class ContentThemesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('content_themes')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        DB::table('content_themes')->insert([
            'name' => 'snow',
            'background' => '#000000',
            'json_data'=> '[
				{
					"type": "textarea",
					"subtype": "tinymce",
					"label": "Text",
					"className": "form-control",
					"name": "textarea-1522309024344",
					"value": "<h1 style=\"text-align: center;\"><span style=\"color: #ff6600;\">Out of Africa</span></h1>\n<p style=\"text-align: center;\"><span style=\"color: #ff6600;\">-------wild life park-------</span></p>\n<p style=\"text-align: center;\">&nbsp;</p>\n<h1><span style=\"background-color: #000000; color: #ff6600;\">Creature Feature</span></h1>"
				},
				{
					"type": "slideshow",
					"label": "Slideshow",
					"name": "slideshow-1522309103471",
            		"values": [
            			{"source":"https://lambda-s3-tac-bucket.s3.us-west-2.amazonaws.com/4970474591115077.png"},
            			{"source":"https://lambda-s3-tac-bucket.s3.us-west-2.amazonaws.com/6196639129360535.png"},
            			{"source":"https://lambda-s3-tac-bucket.s3.us-west-2.amazonaws.com/1913633078310728.png"},
            			{"source":"https://lambda-s3-tac-bucket.s3.us-west-2.amazonaws.com/04460485894430466.png"},
            			{"source":"https://lambda-s3-tac-bucket.s3.us-west-2.amazonaws.com/02581257746743848.png"},
            			{"source":"https://lambda-s3-tac-bucket.s3.us-west-2.amazonaws.com/39504251025935444.png"}
            		]
				},
				{
					"type": "textarea",
					"subtype": "tinymce",
					"label": "Text",
					"className": "form-control",
					"name": "description",
					"value": "<p><span style=\"background-color: rgb(0, 0, 0); color: rgb(255, 255, 255);\" data-mce-style=\"background-color: #000000; color: #ffffff;\">Experience an interactive animal encounter Whether you\'re keen on cute and adorable</span></p>"
				}
			]'
        ]);

        DB::table('content_themes')->insert([
            'name' => 'fire',
            'background' => '#ffffff',
            'json_data'=> '[
				{
					"type": "textarea",
					"subtype": "tinymce",
					"label": "Text",
					"className": "form-control",
					"name": "textarea-1522309324031",
					"value": "<h1><span style=\"color: #000000;\">Spotify\'s hardware ambitions seem like a risky distraction</span></h1>\n<p>Few companies make great gadgets the first time</p>\n<h5><span style=\"color: #999999;\">By Chris Velazco, 1h ago</span></h5>"
				},
				{
					"type": "file",
					"subtype": "image",
					"label": "Image",
					"className": "",
					"name": "file-1521508861906",
					"src": "https://lambda-s3-tac-bucket.s3.us-west-2.amazonaws.com/17113775406557075.png"
				},
				{
					"type": "textarea",
					"subtype": "tinymce",
					"label": "Text",
					"className": "form-control",
					"name": "textarea-1522309392928",
					"value": "<p>image credit: Photothek</p><p> </p>\n<p>Look, it\'s not secret that spotify is out to make</p>\n<p>Watch, Amazon Echo and snap Spectacles.</p>"
				}
			]'
        ]);

        DB::table('content_themes')->insert([
            'name' => 'sun',
            'background' => '#ffffff',
            'json_data'=> '[
				{
					"type": "file",
					"subtype": "image",
					"label": "Image",
					"className": "backpanel",
					"name": "file-1521509165530",
					"kind": "backpanel",
					"src": "https://lambda-s3-tac-bucket.s3.us-west-2.amazonaws.com/4900835331412068.jpg"
				},
				{
					"type": "textarea",
					"subtype": "tinymce",
					"label": "Text",
					"className": "form-control backpanel-inner",
					"name": "textarea-1521509476090",
					"value": "<h1><span style=\"background-color: #ffffff;\">The 10 Steps to achieve surfing Nirvana</span></h1>\n<p><span style=\"color: #ffffff;\">A training system created in Australia</span></p>\n<h6><span style=\"color: #ffffff;\">photographer: Jake Stangel</span></h6>",
					"kind": "backpanel-inner"
				},
				{
					"type": "textarea",
					"subtype": "tinymce",
					"label": "Text",
					"className": "form-control",
					"name": "textarea-1521509518202",
					"value": "<p><strong>By James Gaddy</strong></p>\n<p>March 1, 2018 3:17 AM</p>\n<p>—————————————</p>\n<p>\"Catch any waves\"?</p>\n<p>She doesn\'t know it.</p>",
					"kind": "standard"
				}
			]'
        ]);

        DB::table('content_themes')->insert([
            'name' => 'water',
            'background' => '#ffffff',
            'json_data'=> '[
				{
					"type": "file",
					"subtype": "image",
					"label": "Image",
					"className": "fixed",
					"name": "file-1521511347107",
					"kind": "fixed",
					"src": "https://lambda-s3-tac-bucket.s3.us-west-2.amazonaws.com/8056334991006056.png"
				},
				{
					"type": "textarea",
					"subtype": "tinymce",
					"label": "Text",
					"className": "form-control",
					"name": "textarea-1521511375729",
					"value": "<div style=\"background-color: white;\"><h1>Imposter\'s Parker Young Engaged, Expecting Baby with Stephanier Weber</h1>\n<p>By: <span style=\"color: #00ffff;\">MCKENNA AIELLO</span></p>\n<h6><span style=\"color: #999999;\">Wed, Mar.7.2018 6:23 PM</span></h6>\n<p>&nbsp;</p>\n<p><strong>Parker Young</strong> just made things official with his longtime love!</p>\n<p>The Imposter star is Engaged to Stephanie.</p>\n<p>&nbsp;</p>\n<p>Young shared the wonderful news in a.</p>\n<p>Hello</p>\n<p>&nbsp;</p>\n<p>Hi ~~</p>\n<p>&nbsp;</p>\n<p><strong>Parker Young</strong> just made things official with his longtime love!</p>\n<p>The Imposter star is Engaged to Stephanie.</p>\n<p>&nbsp;</p>\n<p>Young shared the wonderful news in a.</p>\n<p>Hello</p>\n<p>&nbsp;</p>\n<p>Hi ~~</p>\n<p>&nbsp;</p>\n<p><strong>Parker Young</strong> just made things official with his longtime love!</p>\n<p>The Imposter star is Engaged to Stephanie.</p>\n<p>&nbsp;</p>\n<p>Young shared the wonderful news in a.</p>\n<p>Hello</p>\n<p>&nbsp;</p>\n<p>Hi ~~</p>\n</div>"
				}
			]'
        ]);

        DB::table('content_themes')->insert([
            'name' => 'blank',
            'background' => '#ffffff',
            'json_data'=> '[]'
        ]);
    }
}
