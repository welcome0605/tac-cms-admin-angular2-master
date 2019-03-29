<?php

use Illuminate\Database\Seeder;

class AppFontFamilySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('fontfamily_type')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        DB::table('fontfamily_type')->insert([
          ['name' => 'Alegreya', 'value' => 'Alegreya'],
          ['name' => 'Alegreya Sans', 'value' => 'Alegreya Sans'],
          ['name' => 'Anonymous Pro', 'value' => 'Anonymous Pro'],
          ['name' => 'Archivo Narrow', 'value' => 'Archivo Narrow'],
          ['name' => 'Arvo', 'value' => 'Arvo'],          
          ['name' => 'Bio Rhyme', 'value' => 'BioRhyme'],                    
          ['name' => 'Bitter', 'value' => 'Bitter'],                    
          ['name' => 'Cabin', 'value' => 'Cabin'],                              
          ['name' => 'Cardo', 'value' => 'Cardo'],                              
          ['name' => 'Chivo', 'value' => 'Chivo'],                              
          ['name' => 'Cormorant', 'value' => 'Cormorant'],
          ['name' => 'Crimson Text', 'value' => 'Crimson Text'],
          ['name' => 'Eczar', 'value' => 'Eczar'],
          ['name' => 'Fira Sans', 'value' => 'Fira Sans'],
          ['name' => 'Inconsolata', 'value' => 'Inconsolata'],
          ['name' => 'Inknut Antiqua', 'value' => 'Inknut Antiqua'],
          ['name' => 'Karla', 'value' => 'Karla'],
          ['name' => 'Lato', 'value' => 'Lato'],
          ['name' => 'Libre Baskerville', 'value' => 'Libre Baskerville'],
          ['name' => 'Libre Franklin', 'value' => 'Libre Franklin'],
          ['name' => 'Lora', 'value' => 'Lora'],
          ['name' => 'Merriweather', 'value' => 'Merriweather'],
          ['name' => 'Montserrat', 'value' => 'Montserrat'],
          ['name' => 'Open Sans', 'value' => 'Open Sans'],
          ['name' => 'Playfair Display', 'value' => 'Playfair Display'],
          ['name' => 'Poppins', 'value' => 'Poppins'],
          ['name' => 'Proza Libre', 'value' => 'Proza Libre'],
          ['name' => 'Raleway', 'value' => 'Raleway'],
          ['name' => 'Roboto', 'value' => 'Roboto'],
          ['name' => 'Roboto Slab', 'value' => 'Roboto Slab'],
          ['name' => 'Rubik', 'value' => 'Rubik'],
          ['name' => 'Source Sans Pro', 'value' => 'Source Sans Pro'],
          ['name' => 'Source Serif Pro', 'value' => 'Source Serif Pro'],
          ['name' => 'Space Mono', 'value' => 'Space Mono'],
          ['name' => 'Spectral', 'value' => 'Spectral'],
          ['name' => 'Work Sans', 'value' => 'Work Sans']
        ]);

    }
}
