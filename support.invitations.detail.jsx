"use strict"

const React = require('react')
const supportInvitationService = require('../../../services/support.invitations.service')
const SupportInvitationLayout = require('./support.invitations.layout')

class SupportInvitationsDetail extends React.PureComponent {
    constructor(props, context) {
        super(props, context)

        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onInputChange = this.onInputChange.bind(this)
        this.onCancelClick = this.onCancelClick.bind(this)


        this.state = {
            formData: {

            },
            user: '',
            submitted: false
        }
    }

    componentDidMount() {

    }

    onInputChange(event) {
        this.setState({ user: event.target.value })
    }

    onCancelClick(event){
        event.preventDefault()
        this.props.angularUrl("/admin/support-invitations/list")
    }

    onFormSubmit(event) {
        let regex = /\S+@\S+\.\S+/
        event.preventDefault()
        this.setState({ submitted: true })
        if(this.supportFormElement.checkValidity() == true){
            if(regex.test(this.state.user)){
                this.state.formData.email = this.state.user
            } else {
                this.state.formData.username = this.state.user
            }
            supportInvitationService.create(this.state.formData)
                .then(data => {
                    alert("Support Invitation created!")
                    this.props.angularUrl("/admin/support-invitations/list")
                })
                .catch(data => {
                    console.log(data)
                })
        }
    }

    render() {
        return (
            <SupportInvitationLayout>
                <form ref={ref => this.supportFormElement = ref} className="supportForm" onSubmit={this.onFormSubmit} noValidate>
                    <div className={"form-group " + (this.state.submitted && this.userElement && !this.userElement.validity.valid ? 'has-error has-feedback' : '')}>
                        <label className="control-label" htmlFor="user">Recipient Username / Email Address</label>
                        <input id="user" value={this.state.user} name="user" className="form-control" type="text"
                            ref={ref => this.userElement = ref} onChange={(event) => this.onInputChange(event)} required />
                        {this.state.submitted && this.userElement && this.userElement.validity.valueMissing && <p className="help-block">A Username or Email is required.</p>}
                    </div>
                    <div className="btn-group pull-right">
                        <button onClick={event => this.onCancelClick(event)} className="btn btn-default">Cancel</button>
                        <button type="submit" className="btn btn-success">Submit</button>
                    </div>
                </form>
            </SupportInvitationLayout>
        )
    }
}

module.exports = SupportInvitationsDetail