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

    if( next.url[1] )
    {
      var checkKey = next.url[1].path,
          parseKey = this.global.parseKey( checkKey.toLowerCase() ),
          keySemi  = parseKey['base']+parseKey['semi'],
          keyText  = parseKey['base']+parseKey['text'],
          enharmonic = this.global.getEnharmonics(keySemi);

      if( checkKey != keyText || enharmonic )
      {
        getKey = enharmonic ? enharmonic : keyText;
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
