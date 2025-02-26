"""Contains functions for the training/testing loop for pytorch model training."""
import torch
def train_step(model: torch.nn.Module, data_loader: torch.utils.data.DataLoader, loss_fn: torch.nn.Module, 
    optimizer: torch.optim.Optimizer, accuracy_fn: callable, device: torch.device="cpu") -> str:
    """Performs the training step for one epoch of a pytorch model training loop.
    Args:
        
        model (torch.nn.Module): The pytorch model to train.
        data_loader (torch.utils.data.DataLoader): The data loader for the training dataset.
        loss_fn (torch.nn._Loss): The loss function to use for training.
        optimizer (torch.optim.Optimizer): The optimizer to use for training.
        accuracy_fn (callable): A function to compute the accuracy of the model. Should accept two arguments, y_pred and y_true, in that order.
        device (torch.device): The device to run the training on. CPU by default.

    Returns:
        A string with the training loss and accuracy for the epoch.
    """
    train_loss, train_acc = 0, 0
    # iterate data loader batches
    for batch, (X, y) in enumerate(data_loader, 0):
        # send tensors to training device
        X, y = X.to(device), y.to(device)
        # forward pass
        model.train()
        y_pred = model(X)
        # calculate loss, adding to running sum for all batches
        loss = loss_fn(y_pred, y) 
        train_loss += loss
        # calculate accuracy, adding to running sum for all batches
        train_acc += accuracy_fn(y_pred.argmax(dim=1), y)
        # zero gradients, backward pass, update weights
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
    # calculate average loss and accuracy
    train_loss /= len(data_loader)
    train_acc /= len(data_loader)

    # return string with training loss and accuracy
    return f"Train loss: {train_loss:.5f}\tTrain accuracy: {train_acc:.2f}%"

def test_step(model: torch.nn.Module, data_loader: torch.utils.data.DataLoader, 
    loss_fn: torch.nn.Module, accuracy_fn: callable, device: torch.device="cpu") -> str:
    """Performs the testing step for one epoch of a pytorch model training loop.
    Args:
        
        model (torch.nn.Module): The pytorch model to test.
        data_loader (torch.utils.data.DataLoader): The data loader for the testing dataset.
        loss_fn (torch.nn._Loss): The loss function to use.
        accuracy_fn (callable): A function to compute the accuracy of the model. Should accept two arguments, y_pred and y_true, in that order.
        device (torch.device): The device to run the testing on. CPU by default.

    Returns:
        A string with the testing loss and accuracy for the epoch.
    """
    test_loss, test_acc = 0, 0
    # put model in testing mode
    model.eval()
    with torch.inference_mode():
        # iterate data loader batches
        for X, y in data_loader:
            # send tensors to testing device
            X, y = X.to(device), y.to(device)
            # get predictions
            y_pred = model(X)
            # calculate loss and accuracy, adding to running totals
            test_loss += loss_fn(y_pred, y).item()
            test_acc += accuracy_fn(y_pred.argmax(dim=1), y)
    # calculate average loss and accuracy
    test_loss /= len(data_loader)
    test_acc /= len(data_loader)
    
    return f"Test loss: {test_loss:.5f}\tTest accuracy: {test_acc:.2f}%"