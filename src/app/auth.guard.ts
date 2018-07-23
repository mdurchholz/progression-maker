import { Injectable } from '@angular/core';
import { CanLoad, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private route: ActivatedRoute, private router: Router, private global: GlobalService) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):Observable<boolean> | Promise<boolean> | boolean {

    var scale = next.url[0].path.toLowerCase(),
        key   = next.url[1] ? next.url[1].path.toLowerCase() : null,

        parseKey = this.global.parseKey(key),
        keySemi  = parseKey['base']+parseKey['semi'],
        keyText  = parseKey['base']+parseKey['text'];
        // enharmonic = getEnharmonics(keySemi);

    console.log(keyText);

    if( next.url[2] )
    {
      this.router.navigate([scale+'/'+key]);
    }
    else if( scale!='major' && scale!='minor' )
    {
      this.router.navigate(['major/'+(key?key:'C')]);
    }
    else if( !key || keyText.toLowerCase()!=key )
    {
      if( scale == 'minor' )
        this.router.navigate(['minor/'+(keyText ? keyText : 'A')]);
      else
        this.router.navigate(['major/'+(keyText ? keyText : 'C')]);
    }
    // else if( enharmonic )
    // {
    //     this.router.navigate([scale+'/'+enharmonic]);
    // }

    return true;
  }
}
