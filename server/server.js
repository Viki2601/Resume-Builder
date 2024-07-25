const cors = require("cors");
const bcrypt = require("bcryptjs");
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
const { userCollection, templatesCollection, starredTemplatesCollection, singleTemplate } = require("./mongo");
require('dotenv').config();
const PORT = process.env.PORT || 8000
const multer = require('multer');
const path = require('path'); const { error } = require("console");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        const originalName = file.originalname;
        const extension = path.extname(originalName);
        const baseName = path.basename(originalName, extension);
        cb(null, baseName + '-' + uniqueSuffix + extension);
    }
});
const upload = multer({ storage: storage })

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(cors());


app.get("/", cors(), (req, res) => { })

async function hashPass(password) {
    const res = await bcrypt.hash(password, 10);
    return res;
}
async function compare(userPass, hashPass) {
    const res = await bcrypt.compare(userPass, hashPass);
    return res;
}


// SignUp endPoint
app.post("/signup", async (req, res) => {
    const form = req.body.form;
    const data = {
        name: form.name,
        email: form.email,
        password: await hashPass(form.password),
    };
    try {
        const check = await userCollection.findOne({ email: form.email })
        if (check) {
            res.json("exists");
        } else {
            res.json("notexists")
            await userCollection.insertMany([data]);
        }
    } catch (e) {
        res.json("Failed...")
    };
});


// Login endPoint
app.post("/login", async (req, res) => {
    const form = req.body.form;
    try {
        const check = await userCollection.findOne({ email: form.email });
        if (check) {
            const passcheck = await compare(form.password, check.password);
            passcheck ? res.json("loginpass") : res.json("loginfail");
        } else {
            res.json("nouser");
        };
    } catch (e) {
        res.json("fail");
    };
});


// OTP verfication for forgot password endPoint
app.post("/sendemail", async (req, res) => {
    try {
        const email = req.body.email;
        const otp = req.body.otp;

        const check = await userCollection.findOne({ email: email });

        if (check) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: 'access.ecourse78@gmail.com',
                    pass: 'sqri zuuz cdbv qewc'
                }
            });
            const mailOption = {
                from: "Job-Land",
                to: email,
                subject: "Password reset",
                text: `Here's your OTP to reset your Password ${otp}`,
            };
            transporter.sendMail(mailOption, (error, info) => {
                if (error) {
                    res.json('fail');
                } else {
                    res.json('pass');
                }
            });
        } else {
            res.json("notexists");
        }
    } catch (e) {
        res.json('fail');
    };
});


// Reset password endPoint
app.post("/resetPassword", async (req, res) => {
    const cookieVal = req.body.cookieVal;
    const password = req.body.password;
    try {
        const newPass = await hashPass(password);
        await userCollection.updateOne(
            { email: cookieVal },
            { $set: { password: newPass } }
        );
        res.json("pass");
    } catch (e) {
        res.json("fail");
    };
});


app.post("/userAccount", async (req, res) => {
    try {
        const email = req.body.cookieVal;
        const check = await userCollection.findOne({ email: email });
        res.json(check);
    } catch (e) {
        console.log(e)
    };
});


app.post("/getAllUsers", async (req, res) => {
    try {
        const check = await userCollection.find();
        res.json(check);
    } catch (e) {
        console.log(e)
    };
});


app.post('/updateAccount', upload.single('profilePicture'), async (req, res) => {
    try {
        const { email, name, phone, city, country } = req.body;
        const profilePictureUrl = req.file ? req.file.filename : null;

        const updateData = { name, phone, city, country };
        if (profilePictureUrl) {
            updateData.profilePictureUrl = profilePictureUrl;
        }

        const user = await userCollection.findOneAndUpdate(
            { email: email },
            updateData,
            { new: true }
        );

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error });
    }
});


app.post('/upload', upload.single('imageUrl'), async (req, res) => {
    const { title, tags } = req.body;
    const imageUrl = req.file ? req.file.path : null;
    try {
        if (!imageUrl) {
            res.status(400).json("Image upload failed");
            return;
        }
        const newTemplate = new templatesCollection({
            title,
            imageUrl,
            tags: JSON.parse(tags)
        });
        await newTemplate.save();
        const templates = await templatesCollection.find();
        res.status(201).json(templates);
    } catch (err) {
        res.status(500).json("Failed to upload template");
    }
});


app.post('/getAllTemplates', async (req, res) => {
    try {
        const template = await templatesCollection.find();
        res.json(template);
    } catch (e) {
        console.log(e);
    };
});


app.post("/getStarredTemplates", async (req, res) => {
    try {
        const email = req.body.cookieVal;
        const check = await starredTemplatesCollection.find({ email: email });
        res.json(check);
    } catch (e) {
        console.log(e)
    };
});


app.post('/getTemplateById/:templateId', async (req, res) => {
    const { templateId } = req.params;
    try {
        const template = await templatesCollection.findById(templateId);
        res.json(template);
    } catch (e) {
        console.log(e);
    };
});


app.post('/getSimilarTemplates', async (req, res) => {
    const { tags } = req.body;
    try {
        const template = await templatesCollection.find({ tags: { $in: tags } });
        res.json(template);
    } catch (e) {
        console.log(e);
    };
});


app.delete('/deleteTemplateById/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await templatesCollection.findByIdAndDelete(id);
        res.status(200).json({ message: 'Template deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete template' });
    }
});


app.post('/addToStarredCollection', async (req, res) => {
    const { email, templateData } = req.body;
    try {
        const newTemplate = new starredTemplatesCollection({ email: email, template: templateData });
        await newTemplate.save();
        res.status(201).json(newTemplate);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


app.post('/removeToStarredCollection', async (req, res) => {
    const { email, templateData } = req.body;
    try {
        const newTemplate = await starredTemplatesCollection.findOneAndDelete({ email: email, template: templateData });
        res.status(201).json(newTemplate);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


app.post('/saveToDownload', upload.single("profileImg"), async (req, res) => {
    try {
        // Parsing the incoming data
        const formData = req.body.formData ? JSON.parse(req.body.formData) : {};
        const education = req.body.education ? JSON.parse(req.body.education) : [];
        const experiences = req.body.experiences ? JSON.parse(req.body.experiences) : [];
        const skills = req.body.skills ? JSON.parse(req.body.skills) : [];
        const languages = req.body.languages ? JSON.parse(req.body.languages) : [];
        const profileImg = req.file;

        // Collecting data
        const updatedData = new singleTemplate({
            profileImg: profileImg ? profileImg.path : null,
            fullname: formData.fullname ?? null,
            professionalTitle: formData.professionalTitle ?? null,
            personalDescription: formData.personalDescription ?? null,
            mobile: formData.mobile ?? null,
            email: formData.email ?? null,
            website: formData.website ?? null,
            address: formData.address ?? null,
            experiences: experiences.length > 0 ? experiences : null,
            education: education.length > 0 ? education : null,
            skills: skills.length > 0 ? skills : null,
            languages: languages.length > 0 ? languages : null,
        });

        // Remove any null fields (optional, if you don't want to save null fields in the database)
        for (const key in updatedData) {
            if (updatedData[key] === null) {
                delete updatedData[key];
            }
        }

        await updatedData.save();

        res.status(201).json(updatedData);
    } catch (e) {
        console.log(e);
        res.status(500).send('Error saving data.');
    }
});


app.get('/graphData', async (req, res) => {
    try {
        const template = await templatesCollection.find();
        const graphData = template.reduce((acc, app) => {
            const month = new Date(app.createdAt).toLocaleString('default', { month: 'short' });
            if (!acc[month]) acc[month] = 0;
            acc[month]++;
            return acc;
        }, {});
        const graphDataArray = Object.entries(graphData).map(([month, count]) => ({ month, count }));
        res.json(graphDataArray);
    } catch (e) {
        console.log(e);
    };
});

app.get('/userGraphData', async (req, res) => {
    try {
        const user = await userCollection.find();
        const graphData = user.reduce((acc, app) => {
            const month = new Date(app.createdAt).toLocaleString('default', { month: 'short' });
            if (!acc[month]) acc[month] = 0;
            acc[month]++;
            return acc;
        }, {});
        const graphDataArray = Object.entries(graphData).map(([month, count]) => ({ month, count }));
        res.json(graphDataArray);
    } catch (e) {
        console.log(e);
    };
});



app.listen(PORT, () => {
    console.log("Port Connected...");
})