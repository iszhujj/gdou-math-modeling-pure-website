import pubsub from 'pubsub-js'

export default function putForwardProcess(index){
    pubsub.publish('putForwardProcess',index);
}