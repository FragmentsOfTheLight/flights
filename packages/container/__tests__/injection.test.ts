'use strict'
import { injectable } from '../src/decorator/inject'

describe('Injection', () => {
    // it('test.todo')
    test('injectable', () => {

        @injectable()
        class HelloService{

        }

        let hello = new HelloService()
        // expect(hello.id).toBe(1)


    })
})
