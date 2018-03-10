const React = require('react')
const clientProfileService = require('../../services/client.profiles.service')
const userService = require('../../services/users.service')
const filesService = require('../../services/files.service')
const authenticationService = require('../../services/authentication.service')


class ProfileCreateDetail extends React.PureComponent {
    constructor(props, context) {
        super(props, context)
        this.state = {
            bio: "",
            phone: "",
            imageUrl: "",
            reason: "",
            gender: "Male",
            genderOther: "",
            agreesToTerms: false,
            referralDescription: "",
            referralSource: "",
            currentUser: {},
            submitted: false
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleFileChange = this.handleFileChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.submitProfileCreate = this.submitProfileCreate.bind(this)
        this.validityCheck = this.validityCheck.bind(this)

    }
    handleSubmit(event) {
        event.preventDefault()
        this.setState({ submitted: true })
        if (!this.formElement.checkValidity()) { return }
        if (this.state.imageUrl) {
            return filesService.upload(this.state.imageUrl)
                .then(res => {
                    this.setState({
                        imageUrl: res.config.url
                    })
                    this.submitProfileCreate()
                })
        }
        else {
            this.submitProfileCreate()
        }
    }

    submitProfileCreate() {
        let { bio, phone, imageUrl, reason, gender, genderOther, agreesToTerms, referralDescription, referralSource, currentUser } = this.state
        let { firstName, lastName, username, email, isEmailConfirmed, supportedIds, password, userType, agreesToPrivacyStatement, _id } = this.state.currentUser

        if (imageUrl === "") {
            let defaultImageUrl = "/images/Portrait_Placeholder.png"
            imageUrl = defaultImageUrl
        }
        if (gender === "Other") {
            gender = genderOther
        }

        var clientPost = clientProfileService.create({ bio, reason, gender, agreesToTerms, referralDescription, referralSource })
        var userPut = userService.update(this.state.currentUser._id, { phone, imageUrl, firstName, lastName, username, email, isEmailConfirmed, supportedIds, password, userType, agreesToPrivacyStatement, _id })

        Promise.all([clientPost, userPut])

            .then(data => this.props.angularUrl("/my-journal"))
            .catch(err => console.warn(err))
    }

    validityCheck(propertyName) {
        return (this.state.submitted && this[propertyName] && !this[propertyName].validity.valid ? 'has-error has-feedback' : '')
    }

    handleInputChange(e) {
        const target = e.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name

        this.setState({
            [name]: value
        })
    }

    handleFileChange(event) {
        const target = event.target
        const files = target.files[0]

        this.setState({
            imageUrl: files
        })
    }

    componentDidMount() {
        userService.currentUser().then(data => {
            this.setState({
                currentUser: data.item
            })
        })
    }
    render() {
        return (
            <div>
                <h1 className="page-header">Client Profile Create</h1>
                <div className="panel panel-inverse">
                    <div className="panel-heading">
                        <h4 className="panel-title">Finish Creating Profile</h4>
                    </div>
                    <div className="panel-body">
                        <form className="form-horizontal" ref={ref => this.formElement = ref} id="formElement" onSubmit={this.handleSubmit} noValidate>
                            <div className="container-fluid">
                                <div className={"form-group " + this.validityCheck('bioElement')}>
                                    <label className="control-label" htmlFor="bio" name="bio">Bio</label>
                                    <textarea required maxLength="700" rows="5" type="text" placeholder="Enter Your Biography" className="form-control" name="bio"
                                        value={this.state.bio} ref={ref => (this.bioElement = ref)} onChange={this.handleInputChange}></textarea>
                                    <span className="fa fa-times form-control-feedback"></span>
                                    {this.state.submitted && this.bioElement && this.bioElement.validity.valueMissing && (
                                        <p className="help-block">Bio is required</p>)}
                                    {this.state.submitted && this.bioElement &&
                                        this.bioElement.validity.tooLong && (<p className="help-block"> Bio must be 700 characters or less </p>)}
                                </div>
                                <div className={"form-group " + this.validityCheck('reasonElement')}>
                                    <label htmlFor="reason" className="control-label">Reason For Joining</label>
                                    <textarea required name="reason" placeholder="Reason For Joining" maxLength="500" id="reason" cols="30" rows="4" className="form-control" value={this.state.reason} ref={ref => (this.reasonElement = ref)} onChange={this.handleInputChange}></textarea>
                                    <span className="fa fa-times form-control-feedback"></span>
                                    {this.state.submitted && this.reasonElement && this.reasonElement.validity.valueMissing && (
                                        <p className="help-block">Reason for joining is required</p>)}
                                    {this.state.submitted && this.reasonElement &&
                                        this.reasonElement.validity.tooLong && (<p className="help-block"> Reason for joining must be 500 characters or less </p>)}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone (optional)</label>
                                    <input type="tel" id="phone" mask="(999) 999-9999" name="phone" placeholder="(123) 456-7890" className="form-control" value={this.state.phone} onChange={this.handleInputChange} />

                                </div>

                                <div className="form-group">
                                    <label htmlFor="imageUrl">Upload Image</label>
                                    <input type="file" name="imageUrl" placeholder="Image Url" files={this.state.imageUrl} onChange={this.handleFileChange} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="gender" className="m-r-5 control-label">Gender</label>
                                    <div className="radio radio-inline radio-css radio-inverse">
                                        <input type="radio" id="Male" name="gender" value="Male" checked={this.state.gender === "Male"} onChange={this.handleInputChange} />
                                        <label htmlFor="Male">
                                            <span>Male</span>
                                        </label>
                                    </div>
                                    <div className="radio radio-inline radio-css radio-inverse">
                                        <input type="radio" id="Female" name="gender" value="Female" checked={this.state.gender === "Female"} onChange={this.handleInputChange} />
                                        <label htmlFor="Female">
                                            <span>Female</span>
                                        </label>
                                    </div>
                                    <div className="radio radio-inline radio-css radio-inverse">
                                        <input type="radio" id="Other" name="gender" value="Other" checked={this.state.gender === "Other"} onChange={this.handleInputChange} />
                                        <label htmlFor="Other">
                                            <span>Other</span>
                                        </label>
                                    </div>
                                    <div>
                                        <label htmlFor="referred" className="control-label">Other</label>
                                        <input disabled={this.state.gender === "Male" || this.state.gender === "Female"} type="text" maxLength="20" placeholder="Specify other gender" name="genderOther" className="form-control" value={this.state.genderOther} onChange={this.handleInputChange} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="referred" className="control-label">Who referred you? (Optional)</label>
                                    <input type="text" maxLength="200" placeholder="Who referred you? (Optional)" name="referralDescription" className="form-control" value={this.state.referralDescription} onChange={this.handleInputChange} />
                                </div>
                                <div className={"form-group " + this.validityCheck('referralSourceElement')}>
                                    <label htmlFor="referralSource" className="control-label">Referral Source</label>
                                    <select name="referralSource" required className="form-control" value={this.state.referralSource} ref={ref => (this.referralSourceElement = ref)} onChange={this.handleInputChange}>
                                        <option value="">Please Select a referral source</option>
                                        <option value="Friend">Friend</option>
                                        <option value="Therapist">Therapist</option>
                                        <option value="WebSearch">Web Search</option>
                                        <option value="Doctor">Doctor</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <span className="fa fa-times form-control-feedback"></span>
                                    {this.state.submitted && this.referralSourceElement && this.referralSourceElement.validity.valueMissing && (<p className="help-block">Please select a referral source</p>)}
                                </div>
                                <div className={"form-group " + this.validityCheck('agreesToTermsElement')}>
                                    <div className="checkbox checkbox-css checkbox-inline checkbox-inverse">
                                        <input required name="agreesToTerms" type="checkbox" id="inline_css_checkbox_1" checked={this.state.agreesToTerms} onChange={this.handleInputChange} ref={ref => (this.agreesToTermsElement = ref)} />
                                        <label name="agreesToTerms" htmlFor="inline_css_checkbox_1">
                                            <span className="control-label">Agrees To Terms</span>
                                        </label>
                                    </div>
                                    {this.state.submitted && this.agreesToTermsElement &&
                                        this.agreesToTermsElement.validity.valueMissing && (<p className="help-block"> Please agree to terms before proceeding </p>)}
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-success m-r-5">Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div >
            </div >
        )
    }
}

module.exports = ProfileCreateDetail