//
// UI helper
//
import $ from 'jquery';
import 'remodal';
import _ from 'lodash/Lang';

class Ui
{
    constructor()
    {

    }

    /**
     * Show alert message
     */
    alert( message )
    {
        let modal = $('[data-remodal-id="ui--modal--alert"]');
        let inst = modal.remodal();
        let msg = '';

        if ( _.isString( message ))
        {
            msg = $( '<p class="_alert--message"></p>' )
                    .append( msg );
        }
        else if ( _.isArray( message ))
        {
            msg = $( '<ul class="_alert--messages"></ul>' );
            for( let i = 0; i < message.length; i++ )
            {
                msg.append( '<li class="_alert--message">'+message[i]+'</li>' );
            }
        }

        $( '.ui--modal--content', modal ).html( msg );
        inst.open();
    }

    /**
     * Close modal
     */
    closeModal( type )
    {
        let modal = $('[data-remodal-id="ui--modal--'+type+'"]');
        if ( modal.length > 0 ) {
            let inst = modal.remodal();
            inst.close();
        }
    }
};

export default Ui;
