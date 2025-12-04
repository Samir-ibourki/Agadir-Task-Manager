import Tasks from "../models/Tasks.js";

const createtask = async (req, res) => {
  try {
    const { title, description, due_date } = req.body;
    if (!title) {
      return res.status(400).json({
        succes: false,
        message: "title is required",
      });
    }

    const task = await Tasks.create({
      user_id: req.user.id,
      title,
      description,
      due_date,
      status: "pending",
    });
    res.status(201).json({
      succes: true,
      message: "mission is created succesfull",
      data: task,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      succes: false,
      message: "probleme in server",
      error: error.message,
    });
  }
};

const getTask = async (req, res) => {
  try {
    const tasks = await Tasks.findAll({
      where: { user_id: req.user.id },
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("proleme in get tasks", error);
    res.status(500).json({
      success: false,
      message: "probleme du server",
      error: error.message,
    });
  }
};
const updateTask = async (req, res) => {
  try {
    const task = await Tasks.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "task not found  ",
      });
    }

    const { title, description, status, due_date } = req.body;

    await task.update({
      title: title || task.title,
      description: description !== undefined ? description : task.description,
      status: status || task.status,
      due_date: due_date !== undefined ? due_date : task.due_date,
    });

    res.status(200).json({
      success: true,
      message: "task update",
      data: task,
    });
  } catch (error) {
    console.error("probleme in update", error);
    res.status(500).json({
      success: false,
      message: "probleme in server",
      error: error.message,
    });
  }
};
const deleteTask = async (req, res) => {
  try {
    const task = await Tasks.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "tasks nout found",
      });
    }

    await task.destroy();

    res.status(200).json({
      success: true,
      message: "tasks deleted succeful",
    });
  } catch (error) {
    console.error("probleme in delete of task", error);
    res.status(500).json({
      success: false,
      message: "probleme in server",
      error: error.message,
    });
  }
};
export { createtask, getTask, updateTask, deleteTask };
