import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { Product } from './product';

@Injectable()
export class BackEndStub implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // array in local storage for registered users
        const users: any[] = JSON.parse(localStorage.getItem('users')) || [];
        const products: Product[] = JSON.parse(localStorage.getItem('products')) || [];

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

            // authenticate
            if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
                const filteredUsers = users.filter(user => {
                    return user.username === request.body.username && user.password === request.body.password;
                });

                if (filteredUsers.length) {
                    const user = filteredUsers[0];
                    const body = {
                        id: user.id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        token: 'fake-jwt-token'
                    };

                    return of(new HttpResponse({ status: 200, body: body }));
                } else {
                    return throwError({ error: { message: 'Username or password is incorrect' } });
                }
            }

            // get users
            if (request.url.endsWith('/users') && request.method === 'GET') {
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return of(new HttpResponse({ status: 200, body: users }));
                } else {
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            // get products
            if (request.url.endsWith('/products') && request.method === 'GET') {
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return of(new HttpResponse({ status: 200, body: products }));
                } else {
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            // get user by id
            if (request.url.match(/\/users\/\d+$/) && request.method === 'GET') {
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    const urlParts = request.url.split('/');
                    const id = parseInt(urlParts[urlParts.length - 1], 10);
                    const matchedUsers = users.filter(usr => (usr.id === id));
                    const user = matchedUsers.length ? matchedUsers[0] : null;

                    return of(new HttpResponse({ status: 200, body: user }));
                } else {
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            // get product by id
            if (request.url.match(/\/products\/\d+$/) && request.method === 'GET') {
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    const urlParts = request.url.split('/');
                    const id = parseInt(urlParts[urlParts.length - 1], 10);
                    const matchedProducts = products.filter(prdct => (prdct.id === id));
                    const product = matchedProducts.length ? matchedProducts[0] : null;

                    return of(new HttpResponse({ status: 200, body: product }));
                } else {
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            // register user
            if (request.url.endsWith('/users/register') && request.method === 'POST') {
                const newUser = request.body;

                const duplicateUser = users.filter(user => (user.username === newUser.username)).length;
                if (duplicateUser) {
                    return throwError({ error: { message: 'Username "' + newUser.username + '" is already taken' } });
                }

                newUser.id = users.length + 1;
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                return of(new HttpResponse({ status: 200 }));
            }

            // delete user
            if (request.url.match(/\/users\/\d+$/) && request.method === 'DELETE') {
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    const urlParts = request.url.split('/');
                    const id = parseInt(urlParts[urlParts.length - 1], 10);
                    for (let i = 0; i < users.length; i++) {
                        const user = users[i];
                        if (user.id === id) {
                            users.splice(i, 1);
                            localStorage.setItem('users', JSON.stringify(users));
                            break;
                        }
                    }

                    return of(new HttpResponse({ status: 200 }));
                } else {
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }


            // add product
            if (request.url.endsWith('/products/add') && request.method === 'POST') {
                const newProduct = request.body;

                const duplicateProduct = products.filter(product => (product.name === newProduct.name)).length;
                if (duplicateProduct) {
                    return throwError({ error: { message: 'Product with name "' + newProduct.name + '" is already existing' } });
                }

                newProduct.id = products.length + 1;
                products.push(newProduct);
                localStorage.setItem('products', JSON.stringify(products));

                return of(new HttpResponse({ status: 200 }));
            }

            // delete product
            if (request.url.match(/\/products\/\d+$/) && request.method === 'DELETE') {
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    const urlParts = request.url.split('/');
                    const id = parseInt(urlParts[urlParts.length - 1], 10);
                    for (let i = 0; i < products.length; i++) {
                        const product = products[i];
                        if (product.id === id) {
                            products.splice(i, 1);
                            localStorage.setItem('products', JSON.stringify(products));
                            break;
                        }
                    }
                    return of(new HttpResponse({ status: 200 }));
                } else {
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            // update product
            if (request.url.match(/\/products\/\d+$/) && request.method === 'PUT') {
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    const newProduct = request.body;
                    const urlParts = request.url.split('/');
                    const id = parseInt(urlParts[urlParts.length - 1], 10);
                    for (let i = 0; i < products.length; i++) {
                        const product = products[i];
                        if (product.id === id) {
                            products[i] = newProduct;
                            localStorage.setItem('products', JSON.stringify(products));
                            break;
                        }
                    }
                    return of(new HttpResponse({ status: 200 }));
                } else {
                    return throwError({ status: 401, error: { message: 'Unauthorised' } });
                }
            }

            return next.handle(request);

        }))

            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());
    }

}

export let backendStub = {
    provide: HTTP_INTERCEPTORS,
    useClass: BackEndStub,
    multi: true
};
