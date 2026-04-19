import Patient from '../models/Patient.js';

export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ userId: req.user.id }).sort({ createdAt: -1 });
    // Convert _id to id so frontend code mapping isn't broken
    const mappedPatients = patients.map(p => ({
      ...p.toObject(),
      id: p._id.toString()
    }));
    res.json({ success: true, patients: mappedPatients });
  } catch (err) {
    console.error('[PatientController] getPatients error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createPatient = async (req, res) => {
  try {
    const { name, dob, primaryCondition, secondaryConditions, location, additionalContext } = req.body;
    
    const newPatient = await Patient.create({
      userId: req.user.id,
      name,
      dob,
      primaryCondition,
      secondaryConditions,
      location,
      additionalContext,
    });

    const patientData = { ...newPatient.toObject(), id: newPatient._id.toString() };
    res.status(201).json({ success: true, patient: patientData });
  } catch (err) {
    console.error('[PatientController] createPatient error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const patient = await Patient.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updates,
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    const patientData = { ...patient.toObject(), id: patient._id.toString() };
    res.json({ success: true, patient: patientData });
  } catch (err) {
    console.error('[PatientController] updatePatient error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('[PatientController] deletePatient error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
