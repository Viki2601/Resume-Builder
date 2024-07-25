const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://mcvicky2601:cdsFr92hC1M7nKB5@resumebuilder.s6ky9cy.mongodb.net/?retryWrites=true&w=majority&appName=Resumebuilder")
    .then(() => {
        console.log("Mongo Connected...");
    }).catch(() => {
        console.log("Mongo Connection Failed...");
    });


// User Data collection 
const userSchema = new mongoose.Schema({
    profilePictureUrl: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
}, { timestamps: true });


// List of templates collection
const templateSchema = new mongoose.Schema({
    title: {
        type: String
    },
    imageUrl: {
        type: String
    },
    tags: {
        type: Array
    }
}, { timestamps: true });


// List of starred templates collection
const starredTemplateSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    template: {
        type: Object,
        required: true
    }
}, { timestamps: true });


// Define the schema for experiences
const experienceSchema = new mongoose.Schema({
    year: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: false
    },
    companyAndLocation: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
});

// Define the schema for education
const educationSchema = new mongoose.Schema({
    major: {
        type: String,
        required: false
    },
    about: {
        type: String,
        required: false
    },
    university: {
        type: String,
        required: false
    },
    year: {
        type: String,
        required: false
    },
});

// Define the schema for the main document
const singleTemplateSchema = new mongoose.Schema({
    profileImg: {
        type: String,
    },
    fullname: {
        type: String,
        required: false
    },
    professionalTitle: {
        type: String,
        required: false
    },
    personalDescription: {
        type: String,
        required: false
    },
    mobile: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    experiences: [
        experienceSchema
    ],
    education: [
        educationSchema
    ],
    skills: {
        type: [String],
        required: false
    },
    languages: {
        type: [String],
        required: false
    },
});


const userCollection = mongoose.model("userCollection", userSchema);
const templatesCollection = mongoose.model("templatesCollection", templateSchema);
const starredTemplatesCollection = mongoose.model("starredTemplatesCollection", starredTemplateSchema);
const singleTemplate = mongoose.model("singleTemplate", singleTemplateSchema);



const collection = {
    userCollection,
    templatesCollection,
    starredTemplatesCollection,
    singleTemplate
};

module.exports = collection