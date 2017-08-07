//
// Uploader file
//
import _ from 'lodash';
import Config from './../Config';
import Dom from './../Dom';

class Uploader
{
    /**
     * Constructor
     *
     * @param object input
     * @param object settings
     * @return void
     */
    constructor( input, settings = {} )
    {
        this.files = [];
        this.input = new Dom( input );
        this.config = null;

        //set messages
        this.messages = this._getMessages();

        //set settings
        this._setSettings( settings );
    }

    /**
     * Get all files
     *
     * @return array
     */
    files()
    {
        return this.files;
    }

    /**
     * Get all files
     *
     * @param int index
     * @return object
     */
    file( index )
    {
        let file = false;
        if ( typeof this.files[index] !== 'undefined' ) {
            file = this.files[index];
        }
        return file;
    }

    /**
     * Setup file input
     *
     * @return Uploader
     */
    setup()
    {
        this.prepare();
        this.onchange();
    }

    /**
     * Preparing file input
     *
     * @return Uploader
     */
    prepare()
    {
    }

    /**
     * Event on change
     *
     * @return Uploader
     */
    onchange()
    {
        let self = this;
        this.input.on( 'change', (e) => {

            self.selecting( e );
        });
    }

    /**
     * Handler select file
     *
     * @param object e
     * @return Uploader
     */
    selecting( e )
    {
        let file = this.getSelectedFile( e );
        let errors = this.checkFile( file );
        if ( ! errors )
        {
            //Set file
            this.files.push( file );
            //processing file
            this.processingFile( file, e );
        }
        else {
            this.errorFile( errors, e );
        }
    }

    /**
     * Processing file
     *
     * @param object file
     * @param object e
     * @return mixed
     */
    processingFile( file, e )
    {

    }

    /**
     * Handling if file is error
     *
     * @param array errors
     * @param object e
     * @return mixed
     */
    errorFile( errors, e )
    {

    }

    /**
     * Checking file
     *
     * @param object file
     * @return array
     */
    checkFile( file )
    {

    }

    /**
     * Handler select file
     *
     * @param object e
     * @return Uploader
     */
    getSelectedFile( e )
    {
        let file = false;
        if ( typeof e.target.files[0] !== 'undefined' )
        {
            file = e.target.files[0];
        }
        return file;
    }

    /**
     * Set settings
     *
     * @param array settings
     * @return Uploader
     */
    _setSettings( settings )
    {
        let defaultSettings = this._getDefaultSettings();
        this.config = new Config( defaultSettings, settings );
        return this;
    }

    /**
     * Get default settings
     *
     * @return object
     */
    _getDefaultSettings()
    {
        let settings = {
            maxSize: 3200000,
            extensions: 'image.*',
            dimension: false
        };
        return settings;
    }

    /**
     * Get error messages
     *
     * @return object
     */
    _getMessages()
    {
        let messages = {
            size: 'Your image too large. Max size: {maxSize}.',
            type: 'You must select an file {extensions}.',
            dimension: 'Your image must have dimension {dimension}'
        };
        return messages;
    }
};

export default Uploader;
