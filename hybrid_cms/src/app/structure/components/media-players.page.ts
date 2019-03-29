import { Component, OnInit } from '@angular/core';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'cat-page',
  templateUrl: './media-players.html'
})

export class ComponentsMediaPlayers implements OnInit {
  ngOnInit() {

    $(function(){
        $('.mediatec-cleanvideoplayer').cleanvideoplayer();
        $('.mediatec-cleanaudioplayer').cleanaudioplayer();
    })

  }
}

