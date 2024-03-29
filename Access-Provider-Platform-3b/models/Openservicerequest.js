var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchemas = new Schema({
   /* positionid: { type: String,  required: [true, 'Position name must be provided'] },
    positionname: { type: String,  required: [true, 'Position name must be provided'] },
    agreementid: { type: String,  required: [true, ' Agreement ID must be provided'] },
    agreementName: { type: String,  required: [true, ' Agreement Name must be provided'] },
    level: { type: String},
    type: { type: String,  required: [true, 'level must be provided'] },
    onsite: { type: String},
    remote: { type: String, },
    onsiteper: { type: String },
    validfrom: { type: String},
    vailduntil: { type: String},
    biddingstatus: { type: String}, */
    servicerequest_id: { type: String },
    agreement_title_id:{type: String},
    agreement_title: { type: String },
    project_information: { type: String},
    start_date: { type: String },
    end_date: { type: String },
    work_location: { type: String},
    contract_period: { type: String},
    domain: { type: String,  required: [true, 'domain must be provided'] },
    role: { type: String, required: [true, 'role must be provided'] },
    experience: { type: String },
    technology: { type: String },
    further_skills: { type: String},
    upload_resume: { type: String},
    onsite_days: { type: String},
    remote_days: { type: String},
    status: { type: String},
    customer_id: { type: String },
});


const provider_a = mongoose.connection.useDb('provider-a');
const provider_b = mongoose.connection.useDb('provider-b');
const provider_c = mongoose.connection.useDb('provider-c');
const provider_d = mongoose.connection.useDb('provider-d');

const Provider_A_Openservice_Requests = provider_a.model('Openservicerequests', userSchemas);
const Provider_B_Openservice_Requests = provider_b.model('Openservicerequests', userSchemas);
const Provider_C_Openservice_Requests = provider_c.model('Openservicerequests', userSchemas);
const Provider_D_Openservice_Requests = provider_d.model('Openservicerequests', userSchemas);

module.exports = {Provider_A_Openservice_Requests,Provider_B_Openservice_Requests,Provider_C_Openservice_Requests,Provider_D_Openservice_Requests};