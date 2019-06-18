import { EventAggregator } from 'aurelia-event-aggregator';
import { Store } from 'aurelia-store';
import { environment } from './environment';
import { PostRenderStep } from './resources/pipeline-steps/postrender';
import { PreRenderStep } from './resources/pipeline-steps/prerender';
import { MaintenanceStep } from './resources/pipeline-steps/maintenance';
import { PLATFORM } from 'aurelia-pal';
import { Router, RouterConfiguration } from 'aurelia-router';
import { State } from 'store/state';
import { autoinject } from 'aurelia-framework';
import { map, pluck } from 'rxjs/operators';
import { Observable } from 'rxjs';

@autoinject()
export class App {
    private loggedIn = false;
    private loading = false;
    public router: Router;

    constructor(private ea: EventAggregator, private store: Store<State>) {

    }

    bind() {
        this.store.state.subscribe((s: State) => {
            if (s) {
                this.loading = s.loading;
                this.loggedIn = s.loggedIn;
            }
        });
    }

    public configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'Steem Engine';
        config.options.pushState = true;

        config.options.pushState = true;

        config.addPipelineStep('authorize', MaintenanceStep);
        config.addPipelineStep('preRender', PreRenderStep);
        config.addPipelineStep('postRender', PostRenderStep);

        config.map([
            {
                route: ['', 'home'],
                name: 'home',
                moduleId: PLATFORM.moduleName('./routes/home'),
                nav: false,
                title: 'Home'
            },
            {
                route: 'sign-in',
                name: 'signin',
                moduleId: PLATFORM.moduleName('./routes/sign-in'),
                nav: false,
                title: 'Signin'
            },
            {
                route: 'wallet',
                name: 'wallet',
                moduleId: PLATFORM.moduleName('./routes/wallet'),
                nav: 2,
                title: 'Wallet'
            },
            {
                route: 'offerings',
                name: 'offerings',
                moduleId: PLATFORM.moduleName('./routes/offerings'),
                nav: 3,
                title: 'Offerings'
            },
            {
                route: 'tokens',
                name: 'tokens',
                moduleId: PLATFORM.moduleName('./routes/tokens'),
                nav: 1,
                title: 'Tokens',
            },
            {
                route: 'exchange/:symbol?',
                href: `exchange/${environment.NATIVE_TOKEN}`,
                name: 'exchange',
                moduleId: PLATFORM.moduleName('./routes/exchange'),
                nav: 0,
                title: 'Exchange'
            },
            {
                route: 'faq',
                name: 'faq',
                moduleId: PLATFORM.moduleName('./routes/faq'),
                nav: 4,
                title: 'Faq'
            }
        ]);

        this.router = router;
    }
}
