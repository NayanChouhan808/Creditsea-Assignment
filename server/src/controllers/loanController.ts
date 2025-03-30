import { PrismaClient } from '@prisma/client';
import { Status } from '@prisma/client';

const prisma = new PrismaClient();

export const createLoanApplication = async (req: any, res: any) => {
  const {
    applicantName,
    email,
    amount,
    time,
    employmentStatus,
    employmentAddress,
    purpose
  } = req.body;

  const userId = req.user?.id as string;

  try {
    const newLoan = await prisma.loanApplication.create({
      data: {
        applicantName,
        email,
        amount: parseFloat(amount),
        time,
        employmentStatus,
        employmentAddress,
        purpose,
        userId
      }
    });

    res.status(201).json(newLoan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserLoanApplications = async (req: any, res: any) => {
  try {
    const userId = req.user?.id as string;
    const loans = await prisma.loanApplication.findMany({
      where: { userId },
      include: {
        verifiedBy: {
          select: {
            id: true
          }
        },
        rejectedBy: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(loans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLoanApplications = async (req: any, res: any) => {
  try {
    const loans = await prisma.loanApplication.findMany({
      include: {
        verifiedBy: {
          select: {
            id: true
          }
        },
        rejectedBy: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(loans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLoanApplicationById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const loan = await prisma.loanApplication.findUnique({
      where: { id },
      include: {
        verifiedBy: {
          select: {
            id: true
          }
        },
        rejectedBy: {
          select: {
            id: true
          }
        }
      }
    });

    if (!loan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    res.json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyLoanApplication = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const loan = await prisma.loanApplication.findUnique({
      where: { id }
    });

    if (!loan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    if (loan.status !== Status.PENDING) {
      return res.status(400).json({
        message: `Loan application cannot be verified because it is already ${loan.status.toLowerCase()}`
      });
    }

    const updatedLoan = await prisma.loanApplication.update({
      where: { id },
      data: {
        status: Status.VERIFIED,
        verifiedById: req.user?.id
      },
      include: {
        verifiedBy: {
          select: {
            id: true
          }
        }
      }
    });

    res.json(updatedLoan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const rejectLoanApplication = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const loan = await prisma.loanApplication.findUnique({
      where: { id }
    });

    if (!loan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    if (loan.status === Status.REJECTED || loan.status === Status.APPROVED) {
      return res.status(400).json({
        message: `Loan application cannot be rejected because it is already ${loan.status.toLowerCase()}`
      });
    }

    const updatedLoan = await prisma.loanApplication.update({
      where: { id },
      data: {
        status: Status.REJECTED,
        rejectedById: req.user?.id,
        rejectionReason
      },
      include: {
        rejectedBy: {
          select: {
            id: true
          }
        }
      }
    });

    res.json(updatedLoan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const approveLoanApplication = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const loan = await prisma.loanApplication.findUnique({
      where: { id }
    });

    if (!loan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    if (loan.status !== Status.VERIFIED) {
      return res.status(400).json({
        message: 'Loan application must be verified before approval'
      });
    }

    const updatedLoan = await prisma.loanApplication.update({
      where: { id },
      data: {
        status: Status.APPROVED,
        approvedById: req.user?.id
      },
      include: {
        approvedBy: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });

    res.json(updatedLoan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLoanStatistics = async (req: any, res: any) => {
  try {
    const totalLoans = await prisma.loanApplication.count();
    const pendingLoans = await prisma.loanApplication.count({
      where: { status: Status.PENDING }
    });
    const verifiedLoans = await prisma.loanApplication.count({
      where: { status: Status.VERIFIED }
    });
    const approvedLoans = await prisma.loanApplication.count({
      where: { status: Status.APPROVED }
    });
    const rejectedLoans = await prisma.loanApplication.count({
      where: { status: Status.REJECTED }
    });

    const approvedAmount = await prisma.loanApplication.aggregate({
      where: { status: Status.APPROVED },
      _sum: {
        amount: true
      }
    });

    const recentApplications = await prisma.loanApplication.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        applicantName: true,
        amount: true,
        status: true,
        createdAt: true
      }
    });

    res.json({
      totalLoans,
      pendingLoans,
      verifiedLoans,
      approvedLoans,
      rejectedLoans,
      approvedAmount: approvedAmount._sum.amount || 0,
      recentApplications
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};