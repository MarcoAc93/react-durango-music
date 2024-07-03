import React from "react";
import { Grid, Typography } from "@mui/material";

export type TicketInfo = {
  quantity: number;
  concept: string;
  price: number;
  net: number;
}

type Props = {
  ticketInfo: TicketInfo[];
  total: number;
};

const Ticket = React.forwardRef<HTMLDivElement, Props>(({ ticketInfo, total }, ref) => {
  return (
    <div ref={ref}>
      <Grid container columns={12} sx={{ maxWidth: 350 }} gap={1} paddingInline={1} paddingTop={2}>
        <Grid item textAlign='center'>
          <Typography>Escuela Durango Music</Typography>
          <Typography>Madereros 201, Fidel Velazquez, 34299, Durango, Dgo. Mex</Typography>
          <Typography>Tel: 6181589048</Typography>
        </Grid>
        <Grid item>
          <Typography>{new Date().toLocaleString()}</Typography>
        </Grid>

        <Grid container columns={12}>
          <Typography>-------------------------------------------------------------</Typography>
          <Grid item sm={1}>
            <Typography>#</Typography>
          </Grid>
          <Grid item sm={5}>
            <Typography>Concepto</Typography>
          </Grid>
          <Grid item sm={3}>
            <Typography>Precio</Typography>
          </Grid>
          <Grid item sm={3}>
            <Typography>Importe</Typography>
          </Grid>
          <Typography>-------------------------------------------------------------</Typography>

          {ticketInfo?.map((element, idx) => (
            <Grid container columns={12} key={`${element.concept}-${idx}`}>
              <Grid item sm={1}>
                <Typography>{element.quantity}</Typography>
              </Grid>
              <Grid item sm={5}>
                <Typography>{element.concept}</Typography>
              </Grid>
              <Grid item sm={3}>
                <Typography>${element.price}</Typography>
              </Grid>
              <Grid item sm={3}>
                <Typography>${element.net}</Typography>
              </Grid>
            </Grid>
          ))}
          {/* <Grid container columns={12}>
            <Grid item sm={1}>
              <Typography>1</Typography>
            </Grid>
            <Grid item sm={5}>
              <Typography>Mensualidad</Typography>
            </Grid>
            <Grid item sm={3}>
              <Typography>$350</Typography>
            </Grid>
            <Grid item sm={3}>
              <Typography>$350</Typography>
            </Grid>
          </Grid> */}
          <Typography>-------------------------------------------------------------</Typography>
          <Grid container columns={12}>
            <Grid item sm={1} />
            <Grid item sm={5} />
            <Grid item sm={3}>
              <Typography>Total</Typography>
            </Grid>
            <Grid item sm={3}>
              <Typography>${total}</Typography>
            </Grid>
            <Typography>-------------------------------------------------------------</Typography>
          </Grid>
        </Grid>

        <Grid container columns={12} justifyContent='center'>
          <Grid item>
            <Typography>Gracias por tu pago :)</Typography>
          </Grid>
        </Grid>
      </Grid>
      {/* <table>
        <th>Escuela Durango Music</th>
        <tr className="centered">Eliut Navarro</tr>
        <tr className="centered">Madereros 201, Fidel Velazquez, 34299, Durango, Dgo. Mexico</tr>
        <tr className="centered">Tel: 6181589048</tr>
        <br />
        <tr>{new Date().toLocaleString()}</tr>
        <tr>Alumno: Fulanito detal</tr>
        <tr>-----------------------------------------------</tr>
        <tr>
          <colgroup>
            <col className="contained" />
            <td>Concepto</td>
            <td>Precio</td>
            <td>Importe</td>
          </colgroup>
        </tr>
        <tbody>

        </tbody>
      </table> */}
    </div>
  );
});

export default Ticket;
