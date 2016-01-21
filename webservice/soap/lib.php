<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Moodle SOAP library
 *
 * @package    webservice_soap
 * @copyright  2009 Jerome Mouneyrac
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Moodle SOAP client
 *
 * It has been implemented for unit testing purpose (all protocols have similar client)
 *
 * @package    webservice_soap
 * @copyright  2010 Jerome Mouneyrac
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class webservice_soap_client {

    /** @var moodle_url The server url. */
    private $serverurl;

    /** @var  string The WS token. */
    private $token;

    /** @var array|null SOAP options. */
    private $options;

    /**
     * Constructor
     *
     * @param string $serverurl a Moodle URL
     * @param string $token the token used to do the web service call
     * @param array $options PHP SOAP client options - see php.net
     */
    public function __construct($serverurl, $token = null, $options = null) {
        $this->serverurl = new moodle_url($serverurl);
        if (empty($token)) {
            if ($wstoken = $this->serverurl->get_param('wstoken')) {
                $token = $wstoken;
            }
        }
        $this->set_token($token);
        $this->options = $options;
    }

    /**
     * Set the token used to do the SOAP call
     *
     * @param string $token the token used to do the web service call
     */
    public function set_token($token) {
        $this->token = $token;
    }

    /**
     * Execute client WS request with token authentication
     *
     * @param string $functionname the function name
     * @param array $params the parameters of the function
     * @return mixed
     */
    public function call($functionname, $params) {
        if ($this->token) {
            $this->serverurl->param('wstoken', $this->token);
        }
        if (empty($this->options)) {
            $this->options = array();
        }

        $opts = array(
            'http' => array(
                'user_agent' => 'Moodle SOAP Client'
            )
        );
        $context = stream_context_create($opts);
        $this->options['stream_context'] = $context;
        $this->options['cache_wsdl'] = WSDL_CACHE_NONE;

        $wsdlurl = clone $this->serverurl;
        $wsdlurl->param('wsdl', 1);
        $client = new SoapClient($wsdlurl->out(false), $this->options);

        return $client->__soapCall($functionname, $params);
    }

}