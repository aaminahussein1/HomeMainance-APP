// 1. Haddii aad leedahay Model, halkan ku dhoobso (Import)
// import Service from '../models/Service.js'; 

// 2. Soo saarista dhammaan adeegyada (Get All Services)
export const getServices = async (req, res) => {
    try {
        res.status(200).json({ 
            success: true, 
            message: "Liiska adeegyada si guul leh ayaa loo soo helay." 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Abuurista adeeg cusub (Create Service)
export const createService = async (req, res) => {
    try {
        const { name, description, price } = req.body;
        res.status(201).json({ 
            success: true, 
            message: "Adeegga waa la abuuray!",
            data: { name, description, price }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Helidda hal adeeg (Get Single Service)
export const getServiceById = async (req, res) => {
    try {
        res.status(200).json({ success: true, id: req.params.id });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Wax ka beddelka adeeg (Update Service)
export const updateService = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: "Adeegga waa la cusboonaysiiyay" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. Tiridda adeeg (Delete Service)
export const deleteService = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: "Adeegga waa la tirtiray" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 7. Adeegyada provider gaar ah (Get Services by Provider)
export const getServicesByProvider = async (req, res) => {
    try {
        res.status(200).json({ success: true, providerId: req.params.providerId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};