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

    var getScale = next.url[0].path.toLowerCase(),
        getKey   = '',
        redirect = false;

    if( getScale!='major' && getScale!='minor' )
    {
      getScale = 'major';
      redirect = true;
    }

    if( next.url.length > 1 )
    {
      getKey = next.url[1].path;

      var parseKey = this.global.parseKey( getKey.toLowerCase() ),
          keySemi  = parseKey ? parseKey['base']+parseKey['semi'] : parseKey,
          keyText  = parseKey ? parseKey['base']+parseKey['text'] : parseKey,
          enharmonic = keySemi ? this.global.getEnharmonics(keySemi) : keySemi;

      if( getKey != keyText || enharmonic )
      {
        getKey = enharmonic ? enharmonic : (keyText ? keyText : ( (getScale=='minor') ? 'A' : 'C' ));
        redirect = true;
      }
      else if( next.url.length > 2 )
      {
        redirect = true;
      }
    }
    else
    {
      getKey = (getScale=='minor') ? 'A' : 'C';
      redirect = true;
    }

    if( redirect ) this.router.navigate([getScale+'/'+getKey]);

    return true;
  }
}
